---
slug: adcs
title: "CubeSat ADCS Imaging Testbed (1U)"
subtitle: "ADCS & Systems Engineer"
dates: "December 2025"
location: "Ann Arbor, MI"
hero: "images/adcs_hero.jpg"
tags: ["ADCS","Controls","Sensors","Hardware","EKF","MATLAB","Simulink"]
description: "1U CubeSat ADCS testbed featuring EKF-based attitude estimation, multi-mode control (detumble/pointing/desaturation), and hardware-in-the-loop verification using custom Helmholtz coil and rotating platform."
---

## Overview

Designed and built a self-contained 1U CubeSat attitude determination and control system as part of SPACE 584 (graduate-level ADCS course). The mission objective was threefold: determine spacecraft attitude about a single axis using optical and inertial sensors, actively detumble and stabilize the spacecraft, and image surface features on a scaled Mars analog target at 5 meters range. The project encompassed full-cycle development from requirements derivation through hardware integration and testbed validation.

## System Architecture

### Sensors
- **IMU:** Adafruit TDK InvenSense ICM-20948 9-DoF (3-axis gyroscope, accelerometer, magnetometer). Dual-redundant configuration with unique I2C addresses (0x68/0x69 via AD0 pin). Time-multiplexed magnetometer reads to avoid bus conflicts.
- **Star Tracker:** High-resolution camera with custom pattern-matching algorithm against artificial starfield of known geometry.
- **IR Sun Sensor:** Thermal infrared camera detecting heat source position for coarse attitude determination.
- **Science Camera:** 25mm lens for Mars surface imaging at 1mm feature resolution.

### Actuators
- **Reaction Wheel:** Centrally mounted at geometric center of bottom plate to minimize induced moments. Provides fine attitude control authority.
- **Magnetorquers:** Two orthogonal torque rods for coarse control and momentum desaturation. Custom 3D-printed collars for mounting integration.

### Compute & Data Pipeline
- **Arduino:** Handles all sensor interfacing via I2C, packages data into 86-byte binary packets with CRC16-CCITT checksums.
- **Raspberry Pi:** Runs Simulink-generated EKF for real-time attitude estimation. Transmits 280-byte telemetry packets over UDP (port 5005) at control loop rate.
- **Ground Station:** Web-based dashboard displaying real-time telemetry, EKF estimates, and camera feeds.

### Structure
- **Form Factor:** 10cm × 10cm × ~14cm (1U CubeSat standard)
- **Materials:** PETG polymer bottom plate (0.4cm thick), three 0.063" aluminum mounting plates, M2 brass standoffs
- **Mass Distribution:** Symmetric component grouping to align center of gravity with geometric center

## Methods

### Attitude Determination
Implemented an Extended Kalman Filter in MATLAB with two state variables (angle, angular velocity) for single-axis estimation. The EKF fuses:
- Gyroscope measurements (1 deg/s STD uncertainty)
- Dual magnetometer readings (5–6 nT STD uncertainty)
- Star tracker angle estimates
- IR sun sensor coarse position

System propagates at 10 Hz (0.1s intervals) with measurement updates every 2 seconds. Monte Carlo simulations validated filter convergence within σ-bounds under Gaussian noise assumptions.

### Control Modes
1. **Detumble:** B-dot control law using magnetorquers to reduce angular rates from initial spin-up (tested from 20 deg/s).
2. **Pointing:** Reaction wheel torque commands to achieve and maintain target attitude. Achieved 0.1 Hz control bandwidth with stable transients.
3. **Desaturation:** Magnetorquer-based momentum dumping to prevent reaction wheel saturation during extended operations.

### Calibration
- **Magnetometer:** Calibrated inside Helmholtz coil, rotating through multiple orientations to characterize hard/soft iron distortions and axis scaling errors.
- **Gyroscope:** Bias offsets determined under stationary conditions.
- **Star Tracker:** Pattern matching calibrated against known starfield geometry; identified degenerate distance matches requiring further refinement.

## Testbed Design

Built custom ground support equipment for hardware-in-the-loop validation:

- **Helmholtz Coil:** Generates controlled, uniform magnetic field for magnetorquer testing and magnetometer calibration.
- **Rotating Platform:** Motorized testbed for controlled spin-up; Hall sensor provides ground-truth rotation rate data.
- **Artificial Starfield:** Known star pattern for star tracker algorithm validation.
- **IR Heat Source:** Simulates Sun/Earth limb for sun sensor testing.

## Results & Outcomes

- **Estimation:** EKF achieved bounded state estimation with Monte Carlo validation confirming convergence within σ-bounds across simulation runs.
- **Pointing:** Reduced pointing error to **< 1° RMS** in testbed runs with 0.1 Hz control bandwidth.
- **Desaturation:** Verified momentum dumping via magnetorquers without saturating the reaction wheel.
- **Imaging:** Successfully resolved 1mm surface features on Mars analog target at 5m range.
- **Attitude Determination:** Star tracker and sun sensor showed satisfactory agreement (within ~5°) during slew tests from -35° to +5°.

## Lessons Learned & Future Improvements

**What worked well:**
- Modular structural design enabled rapid subsystem integration and late-stage modifications
- Binary packet protocol with CRC checksums ensured reliable sensor data transmission
- Centralized reaction wheel placement minimized dynamic coupling

**Areas for improvement:**
- Star tracker algorithm needs more sophisticated pattern matching (e.g., triangle area method) to eliminate degenerate distance matches
- Thermal drift compensation for long-duration operations
- Tighter timing on embedded control loop for higher bandwidth
- Full 3-axis attitude determination/control for complete orientation capability
- Integration of all sensors into unified autonomous operation (software integration challenges prevented full demonstration)

## Technical Skills Demonstrated

- Extended Kalman Filter design and Monte Carlo validation
- Sensor fusion (IMU, magnetometer, optical sensors)
- Actuator sizing and control law implementation
- Hardware-in-the-loop test architecture
- Embedded systems (Arduino/Raspberry Pi I2C/serial protocols)
- Ground station telemetry systems (UDP, binary protocols)
- Structural design for spaceflight systems

## Gallery

![ADCS hero](images/adcs_hero.jpg)
![ADCS scale](images/adcs_scale.jpg)
![ADCS hardware](images/adcs_hardware.jpg)