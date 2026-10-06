"""
AgroResilience - Simulation Engine
Handles custom multi-year rotation timeline projections and What-If climate stress simulation.
"""

from typing import List, Dict, Any
from recommendation_engine import calculate_rotation_metrics
from crop_database import get_crop_by_id

def simulate_custom_rotation_timeline(
    crop_ids: List[str],
    climate_data: Dict[str, Any],
    soil_type: str = "Loamy",
    water_availability: str = "Medium",
    farmer_priorities: List[str] = None
) -> Dict[str, Any]:
    """
    Simulates year-by-year evolution (Year 1 to Year N) showing how
    soil health, water demand, climate risk, and sustainability evolve over time.
    """
    if not crop_ids:
        crop_ids = ["rice", "lentil", "mustard"]

    metrics = calculate_rotation_metrics(crop_ids, climate_data, soil_type, water_availability, farmer_priorities)

    # Calculate cumulative yearly progression
    timeline_years = []
    current_soil_health = 60.0 # Baseline starting farm condition
    current_sustainability = 58.0

    for i, cid in enumerate(crop_ids, 1):
        crop = get_crop_by_id(cid)
        if not crop:
            continue

        # Impact of this year's crop
        if crop.get("is_nitrogen_fixer"):
            soil_delta = +7.5
            water_factor = 280
            sustain_delta = +8.0
        elif crop.get("family") == "Brassicaceae":
            soil_delta = +3.0 # pest break
            water_factor = 260
            sustain_delta = +5.0
        elif crop.get("water_level") == "High":
            soil_delta = -4.0 if i > 1 and crop_ids[i-2] == cid else -1.0 # monoculture drag
            water_factor = 1100
            sustain_delta = -2.0
        else:
            soil_delta = +1.5
            water_factor = 500
            sustain_delta = +2.5

        current_soil_health = round(max(30.0, min(95.0, current_soil_health + soil_delta)), 1)
        current_sustainability = round(max(35.0, min(96.0, current_sustainability + sustain_delta)), 1)
        climate_risk_level = "Low" if crop.get("drought_tolerance") in ["High", "Very High"] else "Moderate"
        if crop.get("water_level") == "High" and water_availability in ["Low", "Very Low"]:
            climate_risk_level = "High"

        timeline_years.append({
            "year": f"Year {i}",
            "crop_id": crop["id"],
            "crop_name": crop["name"],
            "crop_bangla_name": crop["bangla_name"],
            "family": crop["family"],
            "is_nitrogen_fixer": crop["is_nitrogen_fixer"],
            "water_requirement_mm": crop["water_requirement_mm"],
            "soil_health_projected": current_soil_health,
            "sustainability_projected": current_sustainability,
            "climate_risk": climate_risk_level,
            "key_contribution": crop.get("rotation_benefits", "Crop production")
        })

    return {
        "summary_metrics": metrics,
        "timeline": timeline_years,
        "initial_soil_health": 60.0,
        "final_projected_soil_health": current_soil_health,
        "initial_sustainability": 58.0,
        "final_projected_sustainability": current_sustainability
    }


def run_what_if_climate_scenario(
    temp_delta_c: float,
    rainfall_delta_percent: float,
    water_reduction: bool,
    base_climate_data: Dict[str, Any],
    soil_type: str = "Loamy",
    farmer_priorities: List[str] = None
) -> Dict[str, Any]:
    """
    Evaluates how climate shocks impact different crop rotation strategies:
    - Temp +1°C, +2°C, +3°C
    - Rainfall -10%, -20%, -30%, +20%
    - Water shortage constraint
    Compares Monoculture vs Conventional vs AgroResilience Resilient Strategy.
    """
    if farmer_priorities is None:
        farmer_priorities = ["Improve soil health", "Save water", "Reduce climate risk"]

    # Clone and adjust climate indicators
    base_indicators = base_climate_data.get("indicators", {})
    adj_temp = round(base_indicators.get("mean_temperature_c", 26.0) + temp_delta_c, 1)
    rain_multiplier = 1.0 + (rainfall_delta_percent / 100.0)
    adj_rain = round(base_indicators.get("annual_rainfall_mm", 1200.0) * rain_multiplier, 1)
    
    # Adjust soil moisture index
    base_moisture = base_indicators.get("soil_moisture_index", 0.45)
    adj_moisture = round(max(0.10, min(0.95, base_moisture * rain_multiplier - (temp_delta_c * 0.03))), 2)

    # Adjusted drought status
    if adj_moisture < 0.28 or adj_rain < 600:
        sim_drought = "severe"
    elif adj_moisture < 0.38 or adj_rain < 900:
        sim_drought = "high"
    elif adj_moisture < 0.50:
        sim_drought = "moderate"
    else:
        sim_drought = "low"

    simulated_climate = {
        **base_climate_data,
        "indicators": {
            **base_indicators,
            "mean_temperature_c": adj_temp,
            "annual_rainfall_mm": adj_rain,
            "soil_moisture_index": adj_moisture,
            "drought_code": sim_drought,
            "drought_risk": sim_drought.capitalize()
        }
    }

    effective_water = "Very Low" if (water_reduction or rainfall_delta_percent <= -20) else "Medium"

    strategies_to_test = [
        {
            "name": "Strategy A: Continuous Rice Monoculture",
            "name_bn": "কৌশল ক: অবিচ্ছিন্ন ধান একফসলি",
            "crops": ["rice", "rice", "rice"],
            "type": "Monoculture"
        },
        {
            "name": "Strategy B: Conventional Intensive Cereal",
            "name_bn": "কৌশল খ: প্রচলিত নিবিড় দানাশস্য",
            "crops": ["rice", "wheat", "maize"],
            "type": "High Input"
        },
        {
            "name": "Strategy C: AgroResilience Climate-Smart Rotation",
            "name_bn": "কৌশল গ: এগ্রোরিজিলিয়েন্স জলবায়ু-সহনশীল শস্যাবর্তন",
            "crops": ["rice", "lentil", "mustard"],
            "type": "Smart Resilient"
        },
        {
            "name": "Strategy D: Dryland Pulse & Millet Guardian",
            "name_bn": "কৌশল ঘ: শুষ্ক অঞ্চল ডাল ও কাউন অভিভাবক",
            "crops": ["sorghum", "chickpea", "mustard"],
            "type": "Drought Guardian"
        }
    ]

    scenario_results = []
    for strat in strategies_to_test:
        eval_metrics = calculate_rotation_metrics(
            crop_ids=strat["crops"],
            climate_data=simulated_climate,
            soil_type=soil_type,
            water_availability=effective_water,
            farmer_priorities=farmer_priorities
        )

        overall = eval_metrics["overall_score"]
        water_eff = eval_metrics["sub_scores"]["water_efficiency"]
        climate_res = eval_metrics["sub_scores"]["climate_resilience"]

        # Determine risk assessment under this stress
        if overall >= 80 and water_eff >= 75 and climate_res >= 75:
            risk_badge = "Low Risk (🟢 High Resilience)"
            risk_color = "emerald"
            verdict = "Exceptional endurance. Low water footprint and nitrogen-fixing root architecture withstand heat and rainfall deficit."
        elif overall >= 65:
            risk_badge = "Moderate Risk (🟡 Acceptable)"
            risk_color = "amber"
            verdict = "Manageable with supplemental irrigation and mulching; moderate stress observed."
        elif overall >= 50:
            risk_badge = "High Risk (🟠 Stressed)"
            risk_color = "orange"
            verdict = "Elevated water deficit. Crop flowering likely compromised by temperature anomalies."
        else:
            risk_badge = "Severe Risk (🔴 Crop Failure Hazard)"
            risk_color = "red"
            verdict = "Severe vulnerability. Monoculture water depletion and high evapotranspiration threaten total harvest loss."

        scenario_results.append({
            "strategy_name": strat["name"],
            "strategy_name_bn": strat["name_bn"],
            "crops": strat["crops"],
            "crop_names": eval_metrics["crop_names"],
            "overall_score": overall,
            "soil_health": eval_metrics["sub_scores"]["soil_health"],
            "water_efficiency": water_eff,
            "climate_resilience": climate_res,
            "crop_diversity": eval_metrics["sub_scores"]["crop_diversity"],
            "risk_badge": risk_badge,
            "risk_color": risk_color,
            "verdict": verdict
        })

    # Find the champion
    scenario_results.sort(key=lambda x: x["overall_score"], reverse=True)
    winner = scenario_results[0]

    return {
        "scenario_parameters": {
            "temperature_delta_c": temp_delta_c,
            "rainfall_delta_percent": rainfall_delta_percent,
            "water_reduction_enforced": water_reduction,
            "simulated_mean_temperature_c": adj_temp,
            "simulated_annual_rainfall_mm": adj_rain,
            "simulated_soil_moisture": adj_moisture,
            "simulated_drought_level": sim_drought.capitalize()
        },
        "strategy_evaluations": scenario_results,
        "most_resilient_strategy": winner,
        "scenario_summary": (
            f"Under a {temp_delta_c:+.1f}°C temperature shift and {rainfall_delta_percent:+.0f}% precipitation change, "
            f"'{winner['strategy_name']}' emerges as the most resilient choice with an overall score of {winner['overall_score']}/100. "
            f"Its legume and low-water crop composition mitigates moisture deficit while maintaining soil organic matter."
        )
    }

