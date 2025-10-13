---
slug: airpuck
title: "Air Puck Prototype for Titan"
subtitle: "Design, CFD, Test"
dates: "2023"
location: "Ann Arbor, MI"
hero: "images/airpuck_hero.png"
tags: ["CAD/CFD","Hardware","Testing"]
description: "Hexagonal air-puck optimized for fast traverse and payload, CATIA + STAR-CCM+, Arduino control."
---

## Overview
Earth prototype of a low-profile air-puck aimed at fast course times while carrying payload under strict power and parts limits. Cardboard shell, one Arduino, one 9 V battery, one motor controller, one prop, total mass under 800 g. Built as an Earth stand-in for Titan surface travel.

## Approach
- **Geometry and materials:** Regular hexagon base, ~14 in point to point. Plenum Ø ~12 in, height ~2.5 in. Inlet Ø ~5 in. Skirt gap ~0.1 in. Laser-cut cardboard with tape and hot glue. Electronics on the top deck for weight distribution.
- **CAD:** CATIA model and flat patterns for the laser cutter. Dimensioned drawings for quick rebuilds.
- **CFD:** STAR-CCM+ ground-effect setup. Inlet velocity sweep to 2 m/s, hover gap fixed at ~0.1 in. Predicted lift ≈ 1.41 N at ~1.51 W for the lift case.
- **Controls and test method:** Arduino-based throttle profiles, single ESC and prop. Bench lift checks, then timed course runs with payloads stepped 0 to 100 g.

## Results & Outcomes
- **Mass:** 269–329 g across builds, within the 800 g cap.
- **Power (lift study):** ~1.51 W.
- **Simulated lift:** ~1.41 N at 2 m/s inlet with ~0.1 in hover height.
- **Best bench time:** ~6.68 s with 0 g payload.
- **Competition:** 80 g payload completed in ~17.50 s. 100 g attempt stopped short.
- **Notes:** Hex shape simplified fabrication and mounting. Skirt gap tuning strongly affected payload and time.

## What I’d Improve Next
Skirt edge vortex control, nozzle shaping to reduce leakage, higher-efficiency duct or fan, lighter core materials, and better battery and wiring layout. For Titan, switch to aluminum or composite panels, insulate and harden electronics, and retune the motor-prop pair for low temperature.

## Gallery
![Airpuck](images/airpuck_hero.png)


## Gallery
![CFD](images/airpuck_cfd.png)
![Solid model](images/airpuck_solidmodel.png)
![Testing](images/airpuck_testing.png)

