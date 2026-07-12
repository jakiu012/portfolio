---
slug: masa-limelight
title: "MASA Limelight Liquid Rocket"
subtitle: "Avionics Subteam Member"
dates: "Aug 2025 - Present"
location: "Michigan Aeronautical Science Association"
hero: "images/projects/masa-hero.jpg"
tags: ["Avionics", "Embedded C++", "Hardware-in-the-Loop", "Cryogenic Testing", "Rocketry"]
description: "Avionics for MASA Limelight, a student-built liquid bipropellant rocket, including thermocouple firmware, full-stack cryogenic cold-flow operations, E-Box checkout, REDS valve debugging, and HIL telemetry verification."
---

## Overview

Limelight is MASA's liquid bipropellant rocket, flying liquid oxygen as the oxidizer with a COPV-based pressurization system. The program goals were set three years out from the previous vehicle, Clementine: launch safely, and launch in 2026. The vehicle passed through a full campaign of design gates on the way to flight, including hotfire of the thrust and tank section, recovery CDR, a Flight Readiness Review submitted to the FAA for Advanced High Power Rocketry clearance, and a weekly full-stack coldflow campaign running from late January into April 2026.

I joined the avionics subteam, which owns the onboard electronics and ground support electronics: the flight computer and bay boards, power distribution, sensor acquisition, radio telemetry, pyrotechnic and valve actuation circuits, the E-Box ground station electronics, and the hardware-in-the-loop (HITL) test infrastructure used to verify all of it before committing to live propellant operations.

## My Contributions

### Thermocouple Firmware

I worked on firmware for the thermocouple sensing path feeding the vehicle's cryogenic and combustion-adjacent temperature measurements: analog-to-digital conversion, cold-junction compensation, polynomial linearization, and packaging readings into the telemetry stream. Testing the thermocouple firmware, driver, and circuitry for correctness was a standing avionics integration task through the coldflow campaign.

### Cold-Flow Test Operations

I supported the full-stack coldflow campaign, which ran nearly every weekend from late January through early April 2026. These tests flow the propulsion system without ignition to verify oxidizer feed behavior, valve sequencing, and tank pressurization against the planned dP ladders. Coldflow operations required high-pressure and cryogenic safety training, and avionics staffed every test to run ground support equipment and monitor live sensor telemetry.

### E-Box Sensor Checkout

I executed checkout procedures for the E-Box, the ground support electronics enclosure, verifying that thermocouples, pressure transducers, and related sensor channels read within expected ranges before committing hardware to a test day.

### REDS Valve Debugging

When the team hit an actuation issue with REDS during integration testing, I contributed to the debugging effort, tracing the problem through the electrical harness and control path and supporting swap tests with a replacement valve to isolate the failure mode.

### HIL Infrastructure

I helped build out MASA's HITL test capability, which emulates the rocket's sensor environment electrically so the flight avionics can be exercised end to end without live hardware. The HITL effort spans control boards, load emulation, digital sensor emulation over I2C and SPI, and thermocouple / pressure-transducer analog emulation using DACs with resistor networks.

## The 2026 Launch Campaign

By April 2026 the vehicle had completed its final coldflows, held its public reveal, and entered the launch flow, with the team targeting flight within weeks. In parallel, avionics shipped a payload for the USCRPL spaceshot collaboration and design work began on the next vehicle, Citron.

## What This Project Teaches Me

Rocketry avionics is unforgiving in a different way than spacecraft work. The time constants are shorter, the consequences of a harnessing error are immediate, and the test cadence is weekly rather than semesterly. Working under a test-readiness-review culture — SOPs approved before hardware moves, sensors checked out before pressurization, HIL verification before live fire — has been the best systems-engineering education I've had.

This project complements my CubeSat ADCS work by adding cryogenic propulsion-adjacent systems, live high-pressure test operations, and rapid debug cycles at the pad when hardware does not behave as expected.
