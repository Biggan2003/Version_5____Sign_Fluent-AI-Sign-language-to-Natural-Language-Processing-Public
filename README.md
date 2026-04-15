# 🤟 Sign-Fluent AI:Neural Gesture Real-Time Sign Language Interpreter

<p align="center">
   <img src="https://img.shields.io/badge/Computer_Vision-MediaPipe-blue?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Generative_AI-Gemini_Pro-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Architecture-Hybrid_AI_Pipeline-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

### 🌐 Live Demo: https://biggan-sign-fluent-ai.netlify.app/
---
<img width="1277" height="941" alt="Screenshot 2026-04-16 010411" src="https://github.com/user-attachments/assets/fa2309fe-3123-4313-81b2-316fe79b5590" />

**✨ Sign-Fluent AI** represents a sophisticated fusion 🧬 of **Computer Vision (CV)** 👁️ and **Large Language Models (LLMs)** 🤖. Unlike traditional pattern-matching systems, this project implements a high-performance pipeline 🏗️ that decodes spatial hand landmarks 📍 into semantic embeddings 🔢, which are then processed via Generative AI 🧠 to produce contextually accurate natural language 🗣️.

---

## 🌐 Vision: Breaking the Silences with Artificial Intelligence 🌍

In a world 🌎 where communication is a fundamental human right ⚖️, millions of individuals belonging to the hearing and speech-impaired community face an invisible barrier 🚧. **Sign-Fluent AI** 🤟 was born from a singular, powerful ambition: **To ensure that no voice goes unheard.** 📢

**MY mission** 🎯 is to democratize communication 🤝 by providing a real-time, AI-driven bridge 🌉 between Sign Language 👐 and Natural Language 📝. By leveraging the power of Computer Vision 📸 and Large Language Models (LLMs) 🤖, we are transforming complex hand gestures into meaningful conversations ✨—empowering general people 👥 to understand, connect, and converse with the speech-impaired community effortlessly 💖.

> *"Technology is at its best when it empowers the marginalized ⚡. We aren't just building an app; we are building a world where silence is no longer a barrier to being understood."* 💡

---

## 🧠 Core AI/ML Architecture 🏛️

### 1. Spatial Feature Extraction (Computer Vision Layer) 🔍
- **Framework:** MediaPipe Hands 🖐️ (Multi-hand tracking 🔄).
- **Process:** Utilizes a **Single-shot Gesture Detection** model ⚡ to extract 21 precise 3D hand landmarks 📍.
- **Optimization:** Implements real-time coordinate normalization 📏 to ensure consistent detection regardless of camera distance or orientation 📸.

### 2. Neural Contextual Translation (LLM Layer) 🤖
- **Model:** Google Gemini Pro 🌌 (Generative Vision-Language Model 🎭).
- **Pipeline:** Raw gesture sequences are fed into a customized prompt engineering layer 📝 that handles:
  - **Temporal Coherence:** Bridging individual signs into fluid sentences 🔗.
  - **Contextual Refinement:** Using Zero-shot learning 🧠 to interpret ambiguous gestures based on surrounding intent 🔮.

### 3. Real-Time Inference Optimization ⚡
- Engineered for low-latency inference 🚀 by offloading the heavy geometric calculations 📐 to the client-side GPU via WebGL 🎮, while keeping the NLP reasoning in a secure cloud-based inference stream ☁️.

---

## 🚀 Technical Highlights 🛠️

- 🔬 **Landmark Geometry:** Analyzes 3D Euclidean distances 📏 between fingertips and palm centers for gesture classification 📐.
- ⚡ **High-Frequency Sampling:** Maintains a constant frame-processing rate 🎞️ to minimize "Input-to-Output" lag ⏱️.
- 🏗️ **Robust NLP Pipeline:** Handles noisy input 🌪️ and incomplete signs 🧩 through advanced prompt-based error correction 🛠️.

---

## 🛠️ Engineering Stack 💻

| Component | Engineering Tool |
| :--- | :--- |
| **Inference Engine** | 🖐️ MediaPipe Hand-Landmarker |
| **NLP & Semantics** | 🧠 Google Gemini Generative AI (LLM) |
| **Logic Layer** | 🛡️ TypeScript (Strictly Typed for Data Integrity) |
| **Environment** | ⚡ Node.js / Vite (High-speed HMR 🔥) |
| **Visual Interface** | 🏗️ React 18 (Component-based Architecture) |

---
## 📂 System Architecture Breakdown

- `/src/services/geminiService.ts`: Manages the LLM inference stream and prompt conditioning.
- `/src/hooks/useHandTracking.ts`: Handles the Computer Vision lifecycle and GPU-accelerated frame analysis.
- `/src/types`: Defines the strict schema for spatial data and AI responses.

---
## 📂 Project Structure

- `src/components`: Reusable UI elements and Camera interface.
- `src/services`: Integration logic for Gemini AI and MediaPipe.
- `src/hooks`: Custom React hooks for gesture management.
- `src/types`: TypeScript interfaces and definitions.

---

## 🎓 Academic Context
This project was developed as a **University Project** to showcase the integration of Computer Vision and Generative AI in solving real-world accessibility challenges.

---

## 🔐 Intellectual Property & Copyright

**© 2026 G.M Biggan. All Rights Reserved.**

This system is a proprietary implementation of a **Hybrid CV-LLM Architecture**. **Unauthorized copying, reverse engineering, or redistribution of the code and logic is strictly prohibited.**

---
<p align="center">
  Architected with 🧠 & 💻 by <b><a href="https://www.linkedin.com/in/g-m-biggan-60032b2b1/">G.M Biggan</a></b>
  <br/>
  <i>AI/ML Engineering Practitioner</i>
</p>
