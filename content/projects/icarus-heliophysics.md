---
slug: icarus-heliophysics
title: "Icarus Heliophysics Mission"
subtitle: "Safety, Policy & Risk Lead; ADCS Contributor"
dates: "Jan 2026 - Apr 2026"
location: "University of Michigan, AEROSP 483"
hero: "images/projects/icarus-launch-gravity-assist.png"
tags: ["Systems Engineering", "Risk Analysis", "NASA PDR", "Policy Compliance", "ADCS Trade Studies"]
description: "Dual-spacecraft heliophysics mission concept through NASA Phase B PDR, with risk analysis, rights-holder mapping, policy compliance, and ADCS trade-study contribution."
---

## Overview

ICARUS, short for I Close 2 The Sun, is a dual-spacecraft heliophysics mission concept developed for the AIAA student competition. The mission places a ScienceSat at the Sun-Mars L1 Lagrange point and a RelaySat in heliocentric orbit to support continuous Earth-Mars communication relay, early warning of coronal mass ejections and solar energetic particle events for Mars astronauts, and comparative heliophysics science aligned with the NAS 2024 Decadal Survey and NASA Moon-to-Mars goals.

The mission had to launch by December 2035, operate through 2049, and remain within a $400M FY2026 budget. Our 12-member team completed a full NASA Phase B Preliminary Design Review gate review.

I served as the sole Safety, Policy, and Risk Lead, and contributed to the ADCS subsystem under the Attitude Determination lead.

## Risk Assessment

I built and maintained a 32-risk register using a NASA-style 5x5 likelihood-consequence matrix. The register was informed by heritage data from STEREO, SOHO, and MAVEN, plus historical solar energetic particle event frequency from NOAA Space Weather Prediction Center data.

| Risk ID | Risk | L | C | Score | Owner |
| --- | --- | --- | --- | --- | --- |
| R-002 | SEP radiation damage to electronics | 3 | 5 | 15 High | C&DH/Radiation |
| R-001 | Solar array degradation over 13-year mission | 3 | 4 | 12 Medium | Power |
| R-007 | Launch delay beyond Dec 2035 | 3 | 4 | 12 Medium | PM |
| R-015 | Battery discharge blackout during eclipse or peak load | 3 | 4 | 12 Medium | Power |
| R-003 | Electric propulsion transfer failure | 2 | 5 | 10 Medium | Propulsion |
| R-014 | Xenon propellant depletion | 2 | 5 | 10 Medium | Propulsion |
| R-017 | Solar array or antenna deployment failure | 2 | 5 | 10 Medium | Structures/Mechanisms |
| R-023 | Lunar flyby navigation error | 2 | 5 | 10 Medium | OM/GNC |

The highest-scoring risk, R-002, reflected the mission's 13-year interplanetary operations window across multiple solar maxima. A single-event upset or total ionizing dose exceedance could permanently damage onboard processing. The mitigation plan used radiation-hardened components, EDAC on memory, and an independent safing controller able to operate even if the primary processor failed.

Each risk carried a subsystem owner, a specific mitigation strategy, and an open status until design verification could retire it.

## Rights-Holder Analysis

I mapped 12 rights-holders onto an impact-power grid:

- Resource providers and decision-makers: NASA Science Mission Directorate, U.S. Congress, launch providers
- Regulatory bodies: FCC/ITU, ITAR/DDTC
- Beneficiaries and operators: Mars astronauts, heliophysics researchers, DSN operators, JPL/MOC
- Low-engagement groups: international agencies, the general public, and amateur astronomers

This mapping clarified whose needs drove hard requirements and whose needs informed mission value. High-power, high-impact entities such as NASA SMD drove requirements. High-impact, lower-power entities such as Mars astronauts shaped mission justification. Regulatory bodies imposed non-negotiable compliance constraints.

## Policy Compliance

I checked the mission design against six regulatory frameworks:

- Outer Space Treaty: civilian scientific mission under NASA authority, with no weapons or nuclear devices placed in orbit
- Liability Convention: U.S. government-sponsored mission on a commercial vehicle, with operations outside Earth orbit reducing conjunction risk
- Registration Convention: both spacecraft registered with UNOOSA through the U.S. State Department before launch
- FCC/ITU spectrum coordination: Ka-band primary and X-band backup coordinated with the Deep Space Network under deep-space research allocations
- NPR 8715.6B orbital debris mitigation: neither spacecraft occupies Earth orbit; both spacecraft are passivized at end of life, and the 25-year Earth-orbit deorbit rule does not apply
- ITAR/DDTC export control: U.S.-sourced or properly licensed components, with no restricted technology transfer required for the student design package

## ADCS Contribution

I contributed to the attitude determination sensor trade study. We evaluated coarse sun sensors, fine sun sensors, magnetometers, star trackers, and IMUs against six weighted metrics: mass, cost, power, size, accuracy, and field of view.

The study supported a sensor suite combining fine sun sensors, coarse sun sensors, and an IMU for complete attitude estimation with redundancy. The star tracker scored highest on accuracy, around 1 arcsecond, but lowest across mass, cost, power, size, and field of view. The selected architecture was a zero-momentum, 3-axis-stabilized spacecraft.

## What I Learned

Safety and risk analysis is not a side task added at the end; it forces subsystem design decisions. The SEP radiation risk influenced C&DH component selection, the launch-delay risk constrained the ConOps timeline, and debris mitigation shaped end-of-life operations.

The rights-holder mapping was more useful than expected. It separated hard constraints from nice-to-have preferences, which helped prevent scope creep during Phase B design.

## Gallery

![Icarus launch and gravity assist concept](images/projects/icarus-launch-gravity-assist.png)
![Icarus science satellite transit concept](images/projects/icarus-science-transit.png)
![Icarus relay satellite transit concept](images/projects/icarus-relay-transit.png)
![Icarus mission data flow diagram](images/projects/icarus-data-flow.png)
