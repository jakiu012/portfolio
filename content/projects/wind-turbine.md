---
slug: wind-turbine
title: "Horizontal-Axis Wind Turbine Generator"
subtitle: "Design Engineer"
dates: "Jan 2024 - Apr 2024"
location: "University of Michigan"
hero: "images/wind_hero.png"
tags: ["Mechanical Design", "Power Systems", "Testing & Instrumentation", "Sustainability"]
description: "Low-cost self-yawing horizontal-axis wind turbine generator for rural energy access, tested on a university rooftop with instrumented voltage, power, efficiency, and tip-speed-ratio analysis."
---

## Overview

The objective was to design, build, and test a low-cost wind turbine generator using locally available materials for rural energy access in Guatemala. The design had to be affordable, maintainable with basic tools, and safe enough to deploy on a university rooftop for live testing.

## Design

We selected a horizontal-axis wind turbine configuration with a self-yawing mechanism based on a lazy Susan bearing. The final design used three 0.80 m blades, for a 1.54 m swept diameter, built from wooden plank frames covered with plastic sheeting and mounted to a circular plywood hub.

A PVC pipe served as the main shaft and connected through a nose assembly to a small DC generator. The total build cost was $110 using plywood, wooden planks, PVC pipe, screws, a generator, and a 3D-printed shaft adapter.

## Safety Verification

To gain rooftop access at the Climate and Space Research Building, the turbine passed five safety inspections:

1. 300 N lateral load test simulating a strong gust, with no supports leaving their mounting surface
2. High-wind disassembly test, where a lab instructor attempted to forcefully remove components
3. Passerby test using a paper towel roll near moving components, with no crushing or contact
4. Technical requirements inspection for wind collection area, materials, and electrical terminals
5. Rooftop integrity check for sharp edges or fasteners that could damage the roof membrane

## Performance Results

Testing was conducted on the CSRB rooftop under natural wind conditions.

| Metric | Result |
| --- | --- |
| Peak voltage | 6.45 V |
| Peak power | 0.17 W |
| Tip-speed ratio | Average 2.5, maximum 7.2 |
| Peak efficiency | 1.2% at low wind speeds near 1.1 m/s |
| Functional output | Illuminated a test lightbulb |

Efficiency decreased inversely with wind speed. The average TSR of 2.5 was below the recommended value of 7 for a horizontal-axis wind turbine. Analysis identified drivetrain losses as the primary bottleneck: generator shaft speed was too low without a gear train.

## Recommended Improvements

- Add a 1:3 gear train to increase generator shaft speed and move the operating point closer to optimal TSR
- Increase blade radius beyond 0.80 m to capture more swept area
- Improve blade surface quality to reduce drag and increase aerodynamic efficiency

## What I Learned

This was my first full end-to-end instrumented performance test: measuring voltage and frequency under varying loads, computing efficiency and tip-speed ratio, and diagnosing where losses occurred.

The gap between theoretical power and measured power was a useful reminder to instrument systems well enough to know where the energy is going.
