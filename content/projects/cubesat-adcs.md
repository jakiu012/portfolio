---
slug: cubesat-adcs
title: "CubeSat ADCS Imaging Testbed"
subtitle: "ADCS & Systems Lead"
dates: "Aug 2025 - Dec 2025"
location: "University of Michigan, SPACE 584"
hero: "images/adcs_hardware.jpg"
tags: ["ADCS", "EKF", "Simulink", "Hardware-in-the-Loop", "Python", "Embedded Systems"]
description: "1U CubeSat prototype with EKF-based attitude estimation, a 5-state mode controller, reaction wheel and magnetorquer actuators, Helmholtz coil hardware-in-the-loop testing, and a Python ground station."
---

## Overview

This was a graduate-level capstone project to design, build, and test a 1U-class CubeSat prototype capable of autonomous detumble-to-imaging operations. The spacecraft had to determine its own attitude, stabilize from an initial spin of 1 rev/s, point a science camera at a Mars analog target 5 meters away, and capture an image with sufficient resolution to resolve 1 mm surface features. The system was verified on a custom hardware-in-the-loop testbed.

I served as ADCS Lead, responsible for attitude determination and control algorithms, sensor selection, actuator sizing, and flight software. I also co-led systems engineering: requirements derivation, mass/power/cost budgets, interface definitions, and integration scheduling for a 15-member team.

## Attitude Determination

I designed a 2-state Extended Kalman Filter in MATLAB with state vector x = [theta, omega], representing angle and angular velocity about a single axis. The system dynamics model propagated attitude using angular-rate integration with process noise for disturbance torques.

The measurement model fused three sources:

- Gyroscope: direct angular-rate measurement from the ICM-20948 IMU, with noise standard deviation near 1 deg/s
- Magnetometer 1: magnetic-field projection yielding cos(theta) * B, with noise standard deviation near 5 nT
- Magnetometer 2: orthogonally mounted projection yielding cos(theta + pi/2) * B, with noise standard deviation near 6 nT

The filter propagated at 10 Hz with measurement updates every 2 seconds. I validated the EKF through Monte Carlo simulation, starting from a deliberate initial-condition error: true state of 100 degrees and 20 deg/s, initial estimate of 0 degrees and 0 deg/s. The filter consistently converged and the estimation errors remained bounded within the sigma envelopes across the runs.

The design called for dual ICM-20948 IMUs for redundancy. The second sensor was damaged during PCB integration testing, reducing the final hardware demonstration to single-sensor operation. The magnetometer-fused EKF was validated in simulation but not used in the final hardware run; optical sensors handled attitude determination during the final test runs.

## Attitude Control

I developed a 5-state controller in Simulink that sequenced the spacecraft through the mission:

- S0 Detumble: no attitude knowledge assumed. Gyroscope-measured spin rate routes directly to the reaction wheel to counteract rotation until the rate drops below the threshold needed for optical sensor operation.
- S1 Coarse Point: gyroscopes remain active while the sun sensor and magnetometers enable coarse attitude determination. The reaction wheel reduces spin rate and slews toward target attitude. If rate exceeds the detumble threshold, the controller reverts to S0.
- S2 Fine Point: star tracker activates for fine attitude determination. The controller drives the spacecraft inside the science camera field of view with angular rate below 0.001 rad/s.
- S3 Science Imaging: camera captures images over a 1-second window and begins downlink.
- S4 Desaturation: magnetorquers activate while the reaction wheel despins to dump stored momentum. This mode was designed but not fully implemented in final hardware because of magnetorquer integration timing.

The controller was validated in Simulink with randomized initial conditions. Detumble completed in about 45 seconds, followed by about 4 seconds of coarse pointing and about 1 second of fine pointing before the imaging state.

## Actuators

The reaction wheel used a 1000 KV drone motor with a custom-machined flywheel. The flywheel inertia was 7.56e-5 kg*m^2. The spacecraft inertia was modeled as 0.00375 kg*m^2 for a 1.5 kg uniform disk, so a 1 rev/s spacecraft spin required the wheel to spin at about 2976 RPM to absorb the angular momentum.

The inertia ratio was 49.6, meaning each 1 RPM wheel step corresponded to a 0.02 RPM spacecraft-rate change. The 10-bit PWM motor controller provided 1024 bins across a 14,000 RPM range, or 13.67 RPM per bin, which was too coarse for the 0.001 rad/s angular-resolution requirement. We documented a 12-bit controller upgrade path, reducing the command increment to 3.42 RPM per bin.

The magnetorquer design used two custom-wound torque rods sized for a 0.1 A*m^2 dipole moment, about 100 times the disturbance torque at 500 km altitude for a 1U CubeSat. The rods were powered at 14.8 V per the power budget. Custom 3D-printed collars went through three iterations to fit inside the CubeSat volume.

## Sensors

- Gyroscope: Adafruit ICM-20948 9-DoF IMU with 3-axis gyro, accelerometer, and magnetometer
- Star tracker: Raspberry Pi camera imaging an artificial starfield of known geometry, with centroiding and pattern matching
- IR sun sensor: thermal infrared camera detecting a heat source representing the Sun
- Hall sensor: external to the spacecraft, mounted on the testbed rotating platform for ground-truth angular rate

Dual IMUs were configured on the I2C bus with addresses 0x68 and 0x69 through AD0 pin selection. Magnetometer reads were time-multiplexed to avoid address conflicts.

## Data Architecture

The Arduino handled sensor interfacing over I2C and packaged measurements into 86-byte binary packets with a 0x55/0xAA header, validity flags, sequence number, timestamp, six 3-axis sensor fields, and a CRC16-CCITT checksum.

Packets transmitted to the Raspberry Pi over USB serial at 115200 baud. On the Pi, a parser synchronized to packet headers, validated checksums, converted readings to physical units, and fed data to the Simulink-generated estimator and controller stack.

## Ground Station

I built the ground station as a Python application using Plotly Dash. A background thread received 280-byte UDP telemetry packets from the Raspberry Pi at the control-loop rate. The web dashboard refreshed at 10 Hz and displayed:

- EKF attitude and rate estimates with covariance diagonal terms
- Raw sensor values with color-coded validity indicators
- Camera measurement latencies
- Actuator states, including magnetorquer activation and reaction wheel duty cycle
- Current operating mode decoded from the state-machine integer
- Remote camera controls for star tracker, IR, and science camera images

The dashboard was accessible from any device on the local network through a browser, allowing multiple operators to monitor testing simultaneously.

## Testbed

The Helmholtz coil testbed produced a controlled, uniform magnetic field in the test region. The coil met three requirements: field strength at least 3 times Earth's field, field axis orthogonal to the rotation axis, and reproducibility within 10%. The achieved field strength was 168 uT.

The rotating platform was a low-friction turntable used to spin up the spacecraft to initial conditions. The first version had excessive friction, so the team redesigned the bearing and mechanical interface. The CubeSat mounted using four M4 fasteners into heated threaded inserts in the bottom end plate.

## Systems Engineering

I derived Level-1 requirements from mission objectives, maintained the mission traceability matrix linking mission, spacecraft, testbed, and operations requirements, and tracked mass, power, and cost budgets. The final spacecraft came in at 0.95 kg, with total system cost near $3,000 against a $6,000 cap.

## Key Results

- Detumble from 1 rev/s to spin stoppage demonstrated in under 50 seconds against a 60-second requirement
- EKF convergence validated by Monte Carlo simulation with sigma-bounded errors
- Mars analog imaged at 5 m range with visible target features
- Full telemetry path demonstrated from Arduino to Raspberry Pi to UDP to ground station dashboard
- 10-bit motor-controller resolution limitation identified, with 12-bit upgrade path documented

## What I Would Do Differently

The magnetometer hardware failure was the biggest lesson. A redundant sensor design still had a practical single point of failure during integration, so the magnetometer-fused EKF could only be validated in simulation. In a future iteration, I would bring up each sensor independently on a breakout board before PCB integration and schedule sensor integration testing earlier to leave margin for replacement hardware.

The motor-controller resolution issue was caught analytically but too late to source a replacement. I would perform resolution analysis during actuator selection, not after integration, so the controller can be swapped while the design is still flexible.

## Gallery

![CubeSat hardware assembly](images/adcs_hardware.jpg)
![Artificial starfield test setup](images/adcs_hero.jpg)
![CubeSat scale view](images/adcs_scale.jpg)
