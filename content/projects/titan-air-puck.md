---
slug: titan-air-puck
title: "Titan Surface Air Puck"
subtitle: "Design Engineer"
dates: "Jan 2023 - Apr 2023"
location: "University of Michigan, ENGR 100"
hero: "images/airpuck_hero.png"
tags: ["CFD", "CATIA", "STAR-CCM+", "Prototyping", "Competition"]
description: "Hexagonal air-puck lift platform designed in CATIA, validated with STAR-CCM+ CFD, built as a 269 g cardboard prototype, and tested for crossing time and payload capacity."
---

## Overview

This NASA-themed design challenge asked teams to build an Earth prototype of an air puck that could theoretically traverse Titan's surface. The puck had to be launched across the FXB atrium, land in a designated zone in minimum time, and maximize payload while staying under an 800 g total mass constraint.

The prototype used cardboard construction with one Arduino, one 9V battery, a motor controller, and a propeller.

## Design Process

We evaluated multiple geometric shapes for lift characteristics using CFD simulation and analytical calculations from Bernoulli's equation. The hexagonal shape consistently outperformed the alternatives while remaining easy to fabricate.

Final geometry:

- 14-inch base diameter, point to point
- 12-inch plenum diameter
- 2.5-inch plenum height
- 5-inch inlet diameter

I modeled the design in CATIA and ran STAR-CCM+ CFD with an inlet velocity of 2 m/s, hover altitude of 0.1 inches, ground plane lower boundary, and outlet at the gap between the puck lip and the ground. The simulation predicted 1.41 N of lift at 1.51 W input power.

The physical prototype was laser-cut from cardboard and assembled with tape and hot glue. Electronics and the motor mount were secured on the flat plenum surface.

## Competition Results

| Trial | Payload | Crossing time |
| --- | --- | --- |
| 1 testing | 0 g | 6.68 s |
| 2 testing | 20 g | 7.73 s |
| 3 testing | 40 g | 7.13 s |
| 4 testing | 60 g | 15.78 s |
| 5 competition | 60 g | 17.78 s |
| 6 competition | 80 g | 17.50 s |
| 7 competition | 100 g | Did not complete |

Final system mass was 269 g, well under the 800 g constraint. The best crossing time was 6.68 s with no payload, and the maximum payload delivered was 80 g.

## Titan Adaptation Analysis

For Titan's surface, with a mostly nitrogen atmosphere and average temperature near -179 C, the design would need several changes:

- Replace the cardboard shell with aluminum to withstand cryogenic temperatures
- Shield electronics from extreme cold
- Resize the motor for the different air density and increased structural mass

Titan's higher atmospheric density would increase lift, but the heavier shell and cold-rated electronics would increase system mass.

## What I Learned

This was my introduction to the CFD-to-hardware validation loop. The simulation predicted 1.41 N of lift, and the prototype successfully hovered and traversed the course.

The payload results showed how quickly margin disappears near lift limits. The jump from 40 g at 7.13 s to 60 g at 15.78 s showed a nonlinear performance penalty as the system approached its limit.
