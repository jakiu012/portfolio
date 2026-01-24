---
slug: adcs
title: "CubeSat ADCS Imaging Testbed (1U)"
subtitle: "ADCS & Systems Engineer"
dates: "2025 – Present"
location: "Ann Arbor, MI"
hero: "images/adcs_hero.jpg"
tags: ["ADCS","Controls","Sensors","Hardware"]
description: "1U ADCS imaging testbed with EKF estimation, 5-state control modes, and Helmholtz coil HIL verification."
---

## Overview
Goal: Build a 1-axis ADCS imaging testbed for a 1U CubeSat capable of determining attitude using optical and inertial sensors, controlling rotation with a reaction wheel and magnetorquers, and imaging a scaled Mars target at 5 m range. Validate performance via hardware-in-the-loop testing with Helmholtz coil and rotating platform.

## System Architecture

### Sensors
- **IMU:** Adafruit TDK InvenSense ICM-20948 9-DoF (3-axis gyro, 3-axis accelerometer, 3-axis magnetometer) — designed for dual-redundant operation but one sensor damaged during PCB integration
- **Sun Sensor:** Adafruit MLX90640 55° FOV thermal IR camera (24×32 array, resolves −40°C to +300°C)
- **Star Tracker:** Raspberry Pi 12 MP Camera Module 3 with 104° wide-angle lens
- **Science Camera:** Raspberry Pi HQ camera with 25 mm telephoto lens (60 fps, 0.1 s exposure)

### Actuators
- **Reaction Wheel:** 1000 KeV brushless drone motor with custom 3D-printed wheel (I_RW = 7.56×10⁻⁵ kg·m², max 7000 RPM, 10-bit PWM controller)
- **Magnetorquers:** Two air-core solenoids (~3400 turns each, 7 cm rod length, 14.8 V supply, targeting 0.1 Am² dipole moment)

### Compute
- **Onboard Processing:** Raspberry Pi 5 running Python scripts for camera processing and attitude determination
- **Real-time Control:** Arduino for sensor interfaces and actuator commands
- **Algorithm Development:** MATLAB/Simulink for EKF design and Monte Carlo validation

### Interfaces
- UDP telemetry packets (280 bytes, 35 parameters) to Python/Plotly Dash ground station at 10 Hz
- Synchronized logging with sensor validity bitmask
- Remote camera triggering and image downlink

## Methods

### Estimation
- Extended Kalman Filter (EKF) with two state variables: angle (φ) and angular velocity (ω) about single axis
- Measurement model fusing gyroscope rate and two orthogonal magnetometer readings
- System propagation at 10 Hz; sensor measurements at 0.5 Hz (optical) and 2 Hz (magnetometer)
- Monte Carlo simulations validated convergence within σ-bounds under Gaussian noise assumptions (gyro: 1°/s STD, magnetometers: 5–6 nT STD)

### Control Modes (5-State Controller)
- **S0 (Detumble):** Gyroscope-only feedback; reaction wheel counteracts measured rotation until rate drops below sun sensor threshold
- **S1 (Coarse Point):** Adds sun sensor and magnetometer for attitude estimation; modulates reaction wheel to achieve star tracker pointing range
- **S2 (Fine Point):** Activates star tracker for ~1° attitude determination; achieves imaging-quality slew rate (<0.001 rad/s target)
- **S3 (Science Imaging):** Commands science camera for 1 s imaging window; initiates data downlink
- **S4 (Desaturation):** Magnetorquers dump reaction wheel momentum using external Helmholtz field

### Tuning & Validation
- Monte Carlo simulations in MATLAB with 100+ runs
- Magnetometer calibration inside Helmholtz coil (rotating through multiple orientations for bias/scale compensation)
- Gyroscope bias calibration under stationary conditions
- Hall sensor ground truth for rotation rate verification

## Results & Outcomes

### Attitude Determination
- Star tracker achieved **~1° attitude determination accuracy** when star field visible
- Sun sensor operated at ~0.5 Hz update rate; accuracy within 10° at frame edges, improving toward center
- EKF estimates bounded within σ-bounds across Monte Carlo simulations

### Attitude Control
- Reaction wheel demonstrated complete halt and reversal of spacecraft rotation from **1 rev/s to −2.1 rad/s**
- Detumbling test: Magnetorquers + Helmholtz coil stopped spacecraft rotation in **~50 seconds** from manual spin-up
- Reaction wheel required 2676 RPM to counter 1 rev/s satellite rotation (I_ratio = 49.6)

### System Integration
- Final mass: **~0.95 kg** (met ≤1 kg requirement)
- Final dimensions: **10×10×15 cm** (exceeded 10×10×10 cm target)
- Operated on internal battery power for ~30 seconds
- Ground station received telemetry at 10 Hz with EKF estimates, sensor validity flags, and camera feeds

### Testbed Performance
- Helmholtz coil generated 168 µT at 5 V (~3× Earth's field), meeting 10% reproducibility requirement
- Rotating platform achieved controlled 1 rev/s spin-up with 37–90 second spin-down times

### Known Limitations
- Angular resolution requirement (0.001 rad/s) not met due to 10-bit motor controller (13.67 RPM bins vs. required 4.67 RPM)
- Full autonomous operation not achieved due to software integration challenges
- Single IMU operation after second sensor damaged during PCB testing

## What I'd Improve Next
- **Control Resolution:** Upgrade to 12-bit motor controller (3.42 RPM bins) or use lighter reaction wheel to increase I_ratio
- **Star Tracker Robustness:** Implement geometric pattern matching (triangle areas) to eliminate false-positive star identifications
- **Thermal Compensation:** Calibrate sun sensor for lens distortion at frame edges (currently up to 10° error)
- **Embedded Timing:** Move real-time control loop to dedicated microcontroller to achieve deterministic timing
- **Full Integration:** Complete software state machine for autonomous mode transitions without manual intervention
- **Disturbance Rejection:** Add feed-forward compensation for known friction and magnetic interference sources

## Gallery
![ADCS hero](images/adcs_hero.jpg)
