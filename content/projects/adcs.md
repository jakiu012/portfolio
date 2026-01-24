---
slug: adcs
title: "Autonomous ADCS Imaging Testbed (CubeSat scale, 1U)"
subtitle: "ADCS and Systems Engineer"
dates: "Sep 2025 – Present"
location: "Ann Arbor, MI"
hero: "images/adcs_hero.jpg"
tags: ["ADCS","Controls","Sensors","Hardware","Systems Engineering"]
description: "Flight-like 1U observation platform with TRIAD/EKF estimation, B-dot detumble, PID/LQR pointing, and HIL verification."
---

## Overview
Built a flight-like 1U observation platform under 1 kg integrating compute and power, structure, IMU, magnetometer, star, infrared, and science cameras, and actuators (reaction wheel and magnetorquers) to autonomously detumble, point, and image.

## System Architecture
- **Sensors**: IMU, magnetometer, star camera, infrared camera, science camera
- **Actuators**: Single reaction wheel + magnetorquers (momentum management)
- **Compute**: Raspberry Pi with C++ real-time loop, MATLAB/Simulink design
- **Structure**: 1U CubeSat frame (achieved 960 g total mass)
- **Interfaces**: Synchronized logging; calibration scripts

## ADCS Implementation
- **Estimation**: TRIAD and extended Kalman filter with sensor fusion
- **Detumble**: B-dot control using magnetorquers
- **Pointing**: PID and LQR controllers
- **Momentum management**: Wheel desaturation via torque rods
- **Validation**: Python and MATLAB simulations, 1-axis hardware-in-the-loop testbed

## Systems Engineering
- Defined mission requirements, Level 1 requirements, and ADCS requirements
- Created mass, power, and volume budgets
- Developed interface control documents (ICDs)
- Designed Helmholtz coil testbed (at least 3× Earth's magnetic field)
- Built starfield and infrared targets for sensor testing
- Implemented ground-station logging for mode transitions

## Results & Outcomes
- Met imaging requirement of at least **1 mm features at 5 m** distance
- Validated **closed-loop pointing** and **wheel desaturation** on HIL testbed
- Achieved total system mass of **960 g** (under 1 kg target)
- Demonstrated autonomous mode transitions: detumble → pointing → imaging

## What I'd Improve Next
- Enhanced disturbance rejection
- Star-tracker integration for improved attitude accuracy
- Thermal drift compensation
- Tighter timing on the embedded control loop

## Gallery
![ADCS testbed](images/adcs_hero.jpg)
