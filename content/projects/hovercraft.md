---
slug: hovercraft
title: "Hovercraft Prototype"
subtitle: "Mechanical and Electrical Design and Test"
dates: "Mar 2023 – Apr 2023"
location: "Ann Arbor, MI"
hero: "images/hovercraft_hero.png"
tags: ["CAD/CFD","Hardware","Testing","STAR-CCM+"]
description: "Milano-shaped RC hovercraft built under NASA constraints with servo-driven thrust vectoring and CFD-validated design."
---

## Overview
Designed and built a Milano-shaped RC hovercraft under NASA constraints (under 800 g, 55×55×22 cm); delivered a 490.62 g system with servo-driven thrust vectoring and a 3D-printed inlet motor mount to prevent motor shift and organize wiring.

## Design Specifications
- **Shape**: Milano shell for speed and maneuverability
- **Envelope**: 55×55×22 cm (within NASA constraints)
- **Final mass**: 490.62 g (constraint < 800 g)
- **Structure**: Cardboard shell with 3D-printed motor mount for stiffness
- **Controls**: RC transmitter → receiver → Arduino; servo-driven thrust vectoring

## CFD Analysis (STAR-CCM+)
Ran internal and external flow simulations to validate design:

**Internal Flow:**
- Altitude: 0.1 in, inlet: 2 m/s
- Predicted lift: **4.22 N**

**External Flow:**
- Wind-tunnel box simulation, inlet: 10 m/s
- Frontal area: **0.0262 m²**
- Drag coefficient: **Cd = 1.09**
- Higher drag identified at front edges and rear-prop region

## Design Improvements
- Added skirt with **open trailing edge** to maximize lift
- Removed rear wall to improve lift and control on rugs
- 3D-printed inlet motor mount prevents motor shift and organizes wiring

## Results & Outcomes
- **Mass**: 490.62 g final bill of materials
- **Power budget**: 25 W total supply; motors ~16 W; margin ~3 W
- **Testing (best trials)**:
  - Straight path: 18.20 s
  - Figure-8: 1:00.67
  - Mass retrieval: 36 payloads in 6 minutes
- **Competition day**: Straight path 20.19 s; Mass retrieval 18 payloads

## What I'd Improve Next
- Clean, strain-relieved wiring and connectors to survive bumps
- Decouple throttle from steering with closed-loop speed control
- Skirt seam durability and leakage tuning
- Smoother front edges to cut external drag

## Gallery
![Hovercraft hero](images/hovercraft_hero.png)
![Dimensions and layout](images/hovercraft_dims.png)
![Internal CFD](images/hovercraft_internal_cfd.png)
![External CFD](images/hovercraft_external_cfd.png)
![Course diagram](images/hovercraft_course.png)
