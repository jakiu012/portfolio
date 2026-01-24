---
slug: adcs
title: "CubeSat ADCS Imaging Testbed (1U)"
subtitle: "ADCS & Systems Engineer"
dates: "2025 – Present"
location: "Ann Arbor, MI"
hero: "images/adcs_hero.jpg"
tags: ["ADCS","Controls","Sensors","Hardware"]
description: "1U ADCS imaging testbed with TRIAD/EKF estimation, detumble/pointing/desaturation modes, and HIL verification."
---

## Overview
Goal: build a 1U ADCS imaging testbed integrating IMU, magnetometer, and optical sensors with a reaction wheel and torque rods. Establish estimation/control modes and validate with HIL.

## System Architecture
- Sensors: IMU, magnetometer, optical camera(s)
- Actuators: single reaction wheel + magnetorquers (momentum management)
- Compute: C++ real-time loop, MATLAB/Simulink design
- Interfaces: synchronized logging; calibration scripts

## Methods
- Estimation: TRIAD prototype → EKF with sensor fusion
- Control modes: **detumble**, **pointing**, **desaturation**
- Tuning & validation: Monte-Carlo sims + HIL runs; bias/scale calibration

## Results & Outcomes (ACR)
- Implemented EKF and **reduced** pointing error to **< 1° RMS** in testbed runs.
- Verified momentum dumping via torque rods without saturating the wheel.
- Established 0.1 Hz control bandwidth with stable transients on the rig.

## What I’d Improve Next
Disturbance rejection, star-tracker integration, thermal drift compensation, tighter timing on the embedded loop.

## Gallery
![ADCS hero](images/adcs_hero.jpg)
![ADCS hardware](images/adcs_hardware.jpg)
![ADCS scale](images/adcs_scale.jpg)
![Final Spacecraft Assembly CAD](images/Final Spacecraft Assembly CAD.jpg)
![ADCS assembled mass](images/adcs_assembled_mass.jpg)
