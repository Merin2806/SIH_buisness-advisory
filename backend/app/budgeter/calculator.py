from typing import Dict, Any, List

class UnitEconomicsCalculator:
    @staticmethod
    def calculate(
        raw_material_cost_per_unit: float,
        selling_price_per_unit: float,
        daily_units_sold: float,
        working_days_per_month: int = 26,
        rent_per_month: float = 0.0,
        salaries_per_month: float = 0.0,
        transport_cost_per_month: float = 0.0,
        utilities_per_month: float = 0.0,
        packaging_cost_per_month: float = 0.0,
        other_fixed_costs_per_month: float = 0.0,
    ) -> Dict[str, Any]:
        """Calculates precise unit economics and break-even metrics for rural micro-enterprises.
        Handles zero or negative contribution margin safely without zero-division errors.
        """
        # 1. Fixed monthly overhead
        fixed_monthly_costs = round(
            rent_per_month + salaries_per_month + transport_cost_per_month +
            utilities_per_month + packaging_cost_per_month + other_fixed_costs_per_month,
            2
        )

        # 2. Variable cost per unit
        variable_cost_per_unit = round(raw_material_cost_per_unit, 2)

        # 3. Contribution Margin
        contribution_margin = round(selling_price_per_unit - variable_cost_per_unit, 2)
        is_positive_contribution = contribution_margin > 0.0

        if selling_price_per_unit > 0:
            contribution_margin_pct = round((contribution_margin / selling_price_per_unit) * 100.0, 2)
        else:
            contribution_margin_pct = 0.0

        # 4. Break-even Calculations
        if is_positive_contribution:
            break_even_units_per_month = round(fixed_monthly_costs / contribution_margin, 1)
            break_even_daily_units = round(break_even_units_per_month / max(1, working_days_per_month), 1)
            break_even_revenue = round(break_even_units_per_month * selling_price_per_unit, 2)
        else:
            # Cannot break even if variable costs equal or exceed selling price
            break_even_units_per_month = 999999.0
            break_even_daily_units = 999999.0
            break_even_revenue = 999999.0

        # 5. Expected Monthly Performance
        monthly_units = round(daily_units_sold * working_days_per_month, 1)
        expected_monthly_revenue = round(monthly_units * selling_price_per_unit, 2)
        expected_monthly_variable_costs = round(monthly_units * variable_cost_per_unit, 2)
        expected_monthly_operating_expenses = round(fixed_monthly_costs + expected_monthly_variable_costs, 2)
        expected_monthly_operating_profit = round(expected_monthly_revenue - expected_monthly_operating_expenses, 2)

        # 6. Daily Sales Targets
        daily_sales_target_units = break_even_daily_units
        daily_sales_target_revenue = round(daily_sales_target_units * selling_price_per_unit, 2) if is_positive_contribution else 0.0

        # 7. Health Zone Classification
        if not is_positive_contribution:
            margin_health_zone = "Critical Risk (Negative Contribution)"
        elif contribution_margin_pct >= 35.0:
            margin_health_zone = "Safe Zone (Resilient Margin)"
        elif contribution_margin_pct >= 20.0:
            margin_health_zone = "Moderate Zone (Watch Feed/Input Inflation)"
        else:
            margin_health_zone = "High Risk Zone (Vulnerable to Cost Swings)"

        # 8. Sensitivity Analysis (Scenario Variations)
        sensitivity_scenarios: List[Dict[str, Any]] = []
        price_variations = [0.90, 1.0, 1.10]      # -10%, current, +10%
        demand_variations = [0.80, 1.0, 1.20]     # -20%, current, +20%

        for pv in price_variations:
            sim_price = round(selling_price_per_unit * pv, 2)
            sim_cm = round(sim_price - variable_cost_per_unit, 2)
            for dv in demand_variations:
                sim_daily_units = round(daily_units_sold * dv, 1)
                sim_monthly_units = sim_daily_units * working_days_per_month
                sim_rev = round(sim_monthly_units * sim_price, 2)
                sim_var_costs = round(sim_monthly_units * variable_cost_per_unit, 2)
                sim_profit = round(sim_rev - (fixed_monthly_costs + sim_var_costs), 2)
                
                label_p = f"{'+10%' if pv > 1.0 else ('-10%' if pv < 1.0 else 'Base')} Price"
                label_d = f"{'+20%' if dv > 1.0 else ('-20%' if dv < 1.0 else 'Base')} Sales"
                
                sensitivity_scenarios.append({
                    "scenario_label": f"{label_p} / {label_d}",
                    "selling_price": sim_price,
                    "daily_units": sim_daily_units,
                    "monthly_revenue": sim_rev,
                    "monthly_profit": sim_profit,
                    "contribution_margin": sim_cm
                })

        return {
            "raw_material_cost_per_unit": raw_material_cost_per_unit,
            "selling_price_per_unit": selling_price_per_unit,
            "contribution_margin": contribution_margin,
            "contribution_margin_pct": contribution_margin_pct,
            "fixed_monthly_costs": fixed_monthly_costs,
            "variable_cost_per_unit": variable_cost_per_unit,
            "break_even_units_per_month": break_even_units_per_month,
            "break_even_daily_units": break_even_daily_units,
            "break_even_revenue": break_even_revenue,
            "expected_monthly_revenue": expected_monthly_revenue,
            "expected_monthly_variable_costs": expected_monthly_variable_costs,
            "expected_monthly_operating_expenses": expected_monthly_operating_expenses,
            "expected_monthly_operating_profit": expected_monthly_operating_profit,
            "daily_sales_target_units": daily_sales_target_units,
            "daily_sales_target_revenue": daily_sales_target_revenue,
            "margin_health_zone": margin_health_zone,
            "is_positive_contribution": is_positive_contribution,
            "sensitivity_scenarios": sensitivity_scenarios
        }
