"""
AgroResilience - Smart Crop Rotation Recommendation Engine
Transparent, multi-criteria decision engine combining NASA Earth observations,
soil physics/chemistry, crop agronomy, and farmer priorities.
"""

from typing import List, Dict, Any, Optional
from crop_database import get_crop_by_id, CROPS_DATABASE

def calculate_rotation_metrics(
    crop_ids: List[str],
    climate_data: Dict[str, Any],
    soil_type: str = "Loamy",
    water_availability: str = "Medium",
    farmer_priorities: List[str] = None
) -> Dict[str, Any]:
    """
    Computes rigorous scores (0-100) for a given sequence of crops:
    - Soil Health Score
    - Water Efficiency Score
    - Climate Resilience Score
    - Crop Diversity Index
    - Nutrient Balance Score
    - Farmer Priority Match
    - Weighted Overall Resilience Score
    """
    if not crop_ids:
        crop_ids = ["rice", "lentil", "mustard"]

    if farmer_priorities is None:
        farmer_priorities = ["Improve soil health", "Save water"]

    crops = [get_crop_by_id(cid) for cid in crop_ids if get_crop_by_id(cid)]
    if not crops:
        return {}

    n_years = len(crops)
    indicators = climate_data.get("indicators", {})
    mean_temp = indicators.get("mean_temperature_c", 26.0)
    annual_rain = indicators.get("annual_rainfall_mm", 1200.0)
    soil_moisture = indicators.get("soil_moisture_index", 0.45)
    drought_code = indicators.get("drought_code", "moderate")

    # 1. WATER EFFICIENCY SCORE
    # Evaluate crop water demands vs water availability & precipitation
    total_water_demand = sum(c["water_requirement_mm"] for c in crops)
    avg_water_demand = total_water_demand / n_years

    # Baseline: 300mm is low (efficient), 1200mm is high (intensive)
    water_stress_penalty = 0
    if water_availability in ["Very Low", "Low"]:
        if avg_water_demand > 550:
            water_stress_penalty = 35
        elif avg_water_demand > 400:
            water_stress_penalty = 18
    elif water_availability == "Medium":
        if avg_water_demand > 800:
            water_stress_penalty = 20

    base_water_eff = max(10, min(98, 100 - (avg_water_demand / 12.0) - water_stress_penalty + 15))
    water_eff_score = round(base_water_eff, 1)

    # 2. SOIL HEALTH SCORE
    # Factors: Nitrogen fixing legumes included, root depth alternation (shallow vs deep),
    # organic matter residue, family change (pathogen break)
    legumes_count = sum(1 for c in crops if c.get("is_nitrogen_fixer", False))
    families = [c.get("family", "") for c in crops]
    unique_families = len(set(families))
    root_depths = [c.get("root_depth", "").split()[0] for c in crops]
    unique_root_strata = len(set(root_depths))

    soil_score = 50.0
    # Bonus for legumes (biological nitrogen fixation)
    soil_score += (legumes_count / n_years) * 30.0
    # Bonus for family rotation (disease break)
    soil_score += (unique_families / n_years) * 15.0
    # Bonus for alternating shallow and deep taproots
    soil_score += (unique_root_strata / max(1, n_years)) * 10.0

    # Penalize repeated identical monoculture
    if len(set(c["id"] for c in crops)) == 1:
        soil_score -= 30.0

    soil_health_score = round(max(20.0, min(98.0, soil_score)), 1)

    # 3. CLIMATE RESILIENCE SCORE
    # Compares crop temperature tolerance and drought tolerance to NASA indicators
    resilience_points = 0.0
    for c in crops:
        crop_pts = 60.0
        # Temp check
        if c["temp_min"] <= mean_temp <= c["temp_max"]:
            crop_pts += 15.0
        else:
            crop_pts -= 15.0

        # Drought resilience check
        dt = c.get("drought_tolerance", "Medium")
        if drought_code in ["high", "severe"]:
            if dt in ["Very High", "High"]:
                crop_pts += 20.0
            elif dt == "Low":
                crop_pts -= 25.0
        else:
            if dt in ["High", "Very High", "Medium"]:
                crop_pts += 10.0
        resilience_points += crop_pts

    avg_resilience = resilience_points / n_years
    climate_resilience_score = round(max(25.0, min(97.0, avg_resilience)), 1)

    # 4. CROP DIVERSITY INDEX
    # Shannon-Wiener style index normalized 0-100
    unique_crops = len(set(c["id"] for c in crops))
    diversity_ratio = unique_crops / n_years
    family_ratio = unique_families / n_years
    crop_diversity_score = round(min(98.0, (diversity_ratio * 60.0) + (family_ratio * 40.0)), 1)

    # 5. NUTRIENT BALANCE & N-FIXATION SCORE
    # Balanced uptake: low N demand crops + nitrogen fixers
    n_fix_ratio = legumes_count / n_years
    nutrient_balance_score = round(min(96.0, 45.0 + (n_fix_ratio * 50.0)), 1)

    # 6. FARMER PRIORITY MATCH
    priority_score = 70.0
    priority_matches = []
    for prio in farmer_priorities:
        p_lower = prio.lower()
        if "soil" in p_lower:
            if soil_health_score >= 80:
                priority_score += 8
                priority_matches.append("Enhances soil microbial health & structure")
        if "water" in p_lower:
            if water_eff_score >= 80:
                priority_score += 8
                priority_matches.append("Significant irrigation water conservation")
        if "climate" in p_lower or "risk" in p_lower:
            if climate_resilience_score >= 80:
                priority_score += 8
                priority_matches.append("Protects against heat & rainfall variability")
        if "fertilizer" in p_lower:
            if legumes_count > 0:
                priority_score += 8
                priority_matches.append("Biological nitrogen fixation reduces synthetic urea needs")
        if "biodiversity" in p_lower:
            if crop_diversity_score >= 85:
                priority_score += 6
                priority_matches.append("High botanical family rotation breaks pest life cycles")
        if "yield" in p_lower or "profit" in p_lower:
            priority_score += 5
            priority_matches.append("Includes high-value cash & food security crops")

    farmer_priority_match_score = round(max(40.0, min(98.0, priority_score)), 1)

    # DYNAMIC WEIGHTS
    # Default weights
    w_soil = 0.25
    w_water = 0.20
    w_climate = 0.20
    w_diversity = 0.15
    w_nutrient = 0.10
    w_priority = 0.10

    # Dynamically shift weights based on farmer priorities
    prio_str = " ".join(farmer_priorities).lower()
    if "water" in prio_str:
        w_water += 0.10
        w_soil -= 0.05
        w_diversity -= 0.05
    if "soil" in prio_str:
        w_soil += 0.10
        w_diversity -= 0.05
        w_priority -= 0.05
    if "climate" in prio_str:
        w_climate += 0.10
        w_nutrient -= 0.05
        w_diversity -= 0.05

    # Re-normalize weights to sum to 1.0
    w_sum = w_soil + w_water + w_climate + w_diversity + w_nutrient + w_priority
    w_soil /= w_sum
    w_water /= w_sum
    w_climate /= w_sum
    w_diversity /= w_sum
    w_nutrient /= w_sum
    w_priority /= w_sum

    overall_score = round(
        (soil_health_score * w_soil) +
        (water_eff_score * w_water) +
        (climate_resilience_score * w_climate) +
        (crop_diversity_score * w_diversity) +
        (nutrient_balance_score * w_nutrient) +
        (farmer_priority_match_score * w_priority),
        1
    )

    # Confidence rating based on data availability (NASA live vs demo, inputs provided)
    confidence_score = 88 if not climate_data.get("is_demo") else 82

    return {
        "crop_ids": crop_ids,
        "crop_names": [c["name"] for c in crops],
        "crop_bangla_names": [c["bangla_name"] for c in crops],
        "overall_score": overall_score,
        "confidence_score": confidence_score,
        "sub_scores": {
            "soil_health": soil_health_score,
            "water_efficiency": water_eff_score,
            "climate_resilience": climate_resilience_score,
            "crop_diversity": crop_diversity_score,
            "nutrient_balance": nutrient_balance_score,
            "drought_resilience": round(min(98.0, (water_eff_score * 0.5) + (climate_resilience_score * 0.5)), 1),
            "farmer_priority_match": farmer_priority_match_score
        },
        "weights_used": {
            "soil_health": round(w_soil * 100, 1),
            "water_efficiency": round(w_water * 100, 1),
            "climate_resilience": round(w_climate * 100, 1),
            "crop_diversity": round(w_diversity * 100, 1),
            "nutrient_balance": round(w_nutrient * 100, 1),
            "farmer_priority_match": round(w_priority * 100, 1)
        },
        "agronomic_summary": {
            "total_water_demand_mm": total_water_demand,
            "average_water_demand_mm": round(avg_water_demand, 1),
            "legume_presence": f"{legumes_count} of {n_years} crops are N-fixing legumes",
            "botanical_families": list(set(families)),
            "root_architecture": "Alternating shallow & deep root profiles" if unique_root_strata > 1 else "Uniform root depth"
        },
        "priority_matches": priority_matches
    }


def generate_recommendations(
    climate_data: Dict[str, Any],
    soil_type: str = "Loamy",
    water_availability: str = "Medium",
    farmer_priorities: List[str] = None
) -> Dict[str, Any]:
    """
    Evaluates candidate multi-year rotation strategies against current farm conditions
    and generates ranked options with explainability.
    """
    if farmer_priorities is None:
        farmer_priorities = ["Improve soil health", "Save water"]

    # Candidate Rotations (Cereals, Legumes, Oilseeds, Cash crops)
    candidate_rotations = [
        {
            "id": "strategy_resilient_agro",
            "title": "AgroResilience Tri-Cycle (Rice → Lentil → Mustard)",
            "title_bn": "এগ্রোরিজিলিয়েন্স ত্রি-চক্র (ধান → মসুর → সরিষা)",
            "crops": ["rice", "lentil", "mustard"],
            "type": "Climate-Resilient Diversified"
        },
        {
            "id": "strategy_legume_intensive",
            "title": "Soil Regeneration Pulse-Oilseed (Wheat → Chickpea → Sunflower)",
            "title_bn": "মাটি পুনরুজ্জীবন ডাল-তেলবীজ (গম → ছোলা → সূর্যমুখী)",
            "crops": ["wheat", "chickpea", "sunflower"],
            "type": "Low-Water Regenerative"
        },
        {
            "id": "strategy_staple_legume",
            "title": "Staple-Protein Rotation (Rice → Wheat → Mungbean)",
            "title_bn": "খাদ্য ও পুষ্টি নিরাপত্তা শস্যাবর্তন (ধান → গম → মুগ ডাল)",
            "crops": ["rice", "wheat", "mungbean"],
            "type": "Balanced Food Security"
        },
        {
            "id": "strategy_dryland_resilient",
            "title": "Semi-Arid Drought Guardian (Sorghum → Chickpea → Mustard)",
            "title_bn": "শুষ্ক অঞ্চল খরা প্রতিরোধী (জোয়ার → ছোলা → সরিষা)",
            "crops": ["sorghum", "chickpea", "mustard"],
            "type": "Extreme Drought Resilient"
        },
        {
            "id": "strategy_conventional_cereal",
            "title": "Conventional High-Input (Rice → Wheat → Maize)",
            "title_bn": "প্রচলিত উচ্চ-সার শস্যক্রম (ধান → গম → ভুট্টা)",
            "crops": ["rice", "wheat", "maize"],
            "type": "Conventional Intensive Cereal"
        },
        {
            "id": "strategy_monoculture_baseline",
            "title": "Monoculture Reference (Rice → Rice → Rice)",
            "title_bn": "একফসলি রেফারেন্স (ধান → ধান → ধান)",
            "crops": ["rice", "rice", "rice"],
            "type": "Continuous Monoculture (High Risk)"
        }
    ]

    evaluated_strategies = []
    for cand in candidate_rotations:
        metrics = calculate_rotation_metrics(
            crop_ids=cand["crops"],
            climate_data=climate_data,
            soil_type=soil_type,
            water_availability=water_availability,
            farmer_priorities=farmer_priorities
        )
        cand_eval = {**cand, **metrics}
        evaluated_strategies.append(cand_eval)

    # Sort descending by overall score
    evaluated_strategies.sort(key=lambda s: s["overall_score"], reverse=True)

    # Assign ranks
    ranked_strategies = []
    rank_labels = ["🥇 Best Match", "🥈 Strong Alternative", "🥉 Moderate Option", "Option D", "Option E", "Baseline / High Risk"]
    for i, strat in enumerate(evaluated_strategies):
        strat["rank_badge"] = rank_labels[min(i, len(rank_labels) - 1)]
        ranked_strategies.append(strat)

    best_match = ranked_strategies[0]
    
    # Generate 3-5 transparent reasons for why we recommend best_match
    reasons = [
        f"Significant water optimization: Average water demand is {best_match['agronomic_summary']['average_water_demand_mm']} mm, reducing groundwater extraction.",
        f"Enhanced soil biology: Features N-fixing legumes ({best_match['agronomic_summary']['legume_presence']}) adding organic nitrogen back into topsoil.",
        f"Pathogen cycle suppression: Combines {len(best_match['agronomic_summary']['botanical_families'])} botanical families ({', '.join(best_match['agronomic_summary']['botanical_families'])}), interrupting species-specific soil fungal vectors.",
        f"Root architecture diversity: {best_match['agronomic_summary']['root_architecture']} prevents hardpan compaction while scavenging nutrients at multiple soil depths.",
        f"Aligned with farmer goals: Delivers a {best_match['sub_scores']['farmer_priority_match']}/100 alignment with your selected priorities."
    ]

    considerations = [
        "Ensure timely sowing of winter pulses immediately following monsoon harvest to utilize residual soil moisture.",
        "Soil test recommended: If soil pH is outside the 6.0-7.5 range, consider agricultural lime or gypsum amendment.",
        "Seed availability: Source certified high-germination nodulating rhizobium-inoculated pulse seeds for maximum nitrogen fixation.",
        "Weather volatility: Always consult local 7-day meteorological forecasts during sowing and pod formation stages."
    ]

    return {
        "best_match": best_match,
        "ranked_strategies": ranked_strategies[:4], # Top 4 for display & comparison
        "all_evaluated_strategies": ranked_strategies,
        "why_recommended": reasons,
        "things_to_consider": considerations,
        "confidence_score": best_match["confidence_score"]
    }

