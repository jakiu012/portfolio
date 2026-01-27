---
slug: wind
title: "Wind-Powered Generator for Rural Guatemala"
subtitle: "ME Design, Test, Data"
dates: "December 2024"
location: "Ann Arbor, MI"
hero: "images/wind_hero.png"
tags: ["Hardware","Testing","Energy","Mechanical Design"]
description: "Low-cost HAWT prototype using locally sourceable materials; measured power output of 0.1-0.17 W, end-to-end efficiency up to 1.2%, and tip-speed ratio of 2.5."
---

## Overview

Designed and built a proof-of-concept horizontal-axis wind turbine (HAWT) to provide reliable electricity to rural Guatemala, where approximately 76% of residents face energy poverty.

> The turbine was optimized for **affordability**, **simplicity**, and **safety** using locally sourceable materials.

The final prototype stands 154 cm tall with three 80 cm blades mounted on a wood and PVC structure. It features a self-yawing fin mechanism and successfully passed all five rooftop safety inspections before demonstrating its ability to illuminate a test lightbox.

---

## Design Specifications

### Support System

| Parameter | Value |
|-----------|-------|
| Total height | 154 cm (base to hub) |
| Base | Cross base with two wooden planks (48 cm legs) anchored with cinder blocks |
| Stem | PVC pipe with elevated support system |
| Support clearance | 80 cm from hub to avoid blade interference |

### Hub System

| Component | Details |
|-----------|---------|
| Length | 46 cm |
| Motor | Stepper motor with wooden shaft connected via set screw |
| Bearing | 3D-printed bearing connector mating PVC pipe to hub |
| Yaw mechanism | Turntable (lazy Susan) bearing enables autonomous yawing while base remains stationary |
| Access | Hinged trapdoor design for internal access to motor and wiring |
| Shaft support | Pillow block and bearing provide additional support |

### Blade System

- **Configuration:** Three blades at 120 deg spacing
- **Blade radius:** 80 cm (center to tip)
- **Frame:** Wooden members (70 cm and 30 cm) at 120 deg/60 deg angles
- **Covering:** Plastic wrap (0.0381 cm thick) secured with hot glue
- **Hub connection:** Circular plywood nose plate with dowel-to-motor shaft connection

### Fin/Vane System

- **Dimensions:** ~35 cm x 35 cm plywood
- **Design:** Streamlined corners for reduced drag and improved hub access
- **Function:** Balances turbine and provides passive wind tracking

---

## Technical Approach

### Theoretical Analysis

- Calculated blade length from theoretical HAWT power equation: `P = 1/2 * rho * A * v^3`
- Assumed 10% target efficiency, air density of 1.2 kg/m3, wind speeds of 3.5-5.7 m/s
- Verified gear train requirements using tip-speed ratio formula: `TSR = omega * r / u`
- Calculated minimum shaft connector diameter to withstand combined torque and shear stress

### Electrical Configuration

- Wiring routed internally through hollow shaft to prevent tangling during yaw
- Tested multiple phase/resistor configurations:
  - 1 Phase, 50 ohm and 1k ohm
  - Half Phase, 1k ohm
  - 2 Phase in Series, 1k ohm
- Measured voltage vs. electrical frequency across all configurations to characterize generator performance

### Safety Testing

> All 5 rooftop safety inspections passed

| Test | Description |
|------|-------------|
| 1 | 300N sideways force test (simulated strong gusts) |
| 2 | High winds disassembly resistance test |
| 3 | Passerby safety test (paper towel roll proximity check) |
| 4 | Technical requirements verification (wind collection area, materials, electrical terminals) |
| 5 | Rooftop integrity inspection (no sharp edges to damage roof membrane) |

---

## Results & Outcomes

| Metric | Value |
|--------|-------|
| Power Output | 0.10-0.17 W |
| Peak Voltage | 6.453 V |
| Max Efficiency | 1.2% (at 1.1 m/s wind) |
| Avg Efficiency | 0.546% |
| Tip-Speed Ratio | Avg 2.5 (range 0.1-7.2) |
| Target TSR | 7 (typical HAWT) |
| Total Budget | ~$110 (under $130 limit) |

### Key Findings

- Inverse relationship between efficiency and wind speed - turbine performed better at lower wind speeds
- Successfully powered lightbulb test demonstrating proof-of-concept viability
- End-to-end efficiency calculated using `P = V^2/R` for actual power vs. theoretical wind power

---

## Limitations Identified

### Structural

- Base instability observed at wind speeds >6 m/s due to unsupported section between elevated support and hub
- Turntable bearing undersized for turbine weight and wind-induced torque
- Hot glue and small screws insufficient for long-term bearing attachment

### Mechanical

- Wooden shaft loosened from stepper motor over time, causing efficiency losses
- Blades unbalanced, contributing to high-speed vibration
- Blade pitch/chord distribution opposite of optimal (larger at tip vs. root)

### Operational

- No braking mechanism for safe high-wind shutdowns
- Hub not weatherproofed for outdoor deployment
- Fin interference prevented full trapdoor opening

---

## What I'd Improve Next

### Aerodynamics

- Redesign blades with proper airfoil profile tapering toward tip
- Balance all three blades identically for smooth rotation
- Position radial edge as trailing edge to reduce drag
- Apply tip-loss correction in efficiency calculations

### Drivetrain

- Add ~1:3 gear ratio to increase shaft speed and power output
- Replace wooden dowel with metal shaft for rigid motor coupling
- Use shaft couplings or improved set screw mechanism

### Structure

- Extend elevated support closer to hub or add secondary support
- Upgrade to larger turntable bearing with proper fasteners
- Fully enclose hub for weather protection

### Controls & Safety

- Implement phase-short braking (shorting motor wires) for safe stops
- Add slip ring or cable management for extended yaw rotation

### Sustainability

- Substitute PVC and plastic wrap with recycled materials
- Optimize bill of materials for cost and local availability in Guatemala

---

## Gallery

![Wind - hero](images/wind_hero.png)
![Dimensions and layout](images/wind_dims.png)
![Rooftop test / lightbox demo](images/wind_testing.png)
![Efficiency and TSR plots](images/wind_plots.png)
