---
slug: masa-limelight
title: "MASA Limelight Hybrid Rocket"
subtitle: "Avionics Subteam Member"
dates: "Aug 2025 - Present"
location: "Michigan Aeronautical Science Association"
hero: "images/projects/masa-hero.jpg"
tags: ["Avionics", "Embedded C++", "Hardware-in-the-Loop", "Propulsion Testing", "Rocketry"]
description: "Avionics integration for MASA Limelight, a hybrid rocket targeting 30,000 ft apogee, including thermocouple firmware, cold-flow support, E-Box checkout, REDS valve debugging, and HIL telemetry verification."
---

## Overview

MASA's Limelight is a hybrid rocket vehicle targeting 30,000 ft apogee. I joined the avionics subteam, which is responsible for onboard electronics: sensor acquisition, telemetry, pyrotechnic firing circuits, ground support equipment, and the data pipeline connecting vehicle sensors to the operations console.

## My Contributions

### Thermocouple Firmware

I wrote C++ firmware for thermocouple signal conditioning, including analog-to-digital conversion, cold-junction compensation, and data packaging for the telemetry stream.

### Cold-Flow Test Operations

I participated in cold-flow tests at the MCity test facility. These tests run the propulsion system without ignition to verify oxidizer feed behavior, valve timing, and tank pressurization profiles. My role included configuring ground support equipment and monitoring sensor telemetry in real time.

### E-Box Sensor Checkout

I executed checkout procedures for the electronics box, verifying that thermocouples, pressure transducers, accelerometers, and related sensor paths were reading within expected ranges before committing hardware to a test.

### REDS Valve Debugging

I contributed to debugging the REDS valve actuation path, tracing issues through the electrical harness and control logic to isolate failure modes.

### HIL Infrastructure

I helped build hardware-in-the-loop test infrastructure for sensor and pyrotechnic telemetry verification. The goal is to exercise avionics against simulated sensor inputs before committing to live fire operations.

## What This Project Teaches Me

Rocketry avionics is unforgiving in a different way than spacecraft work. The time constants are shorter, the consequences of a wiring error are immediate, and the test cadence is faster.

This project complements the CubeSat work by adding experience with propulsion-adjacent systems, live test operations, and rapid debug cycles at a test site when hardware does not behave as expected.

## Gallery

![MASA Limelight hybrid rocket on launch rail](images/projects/masa-hero.jpg)
