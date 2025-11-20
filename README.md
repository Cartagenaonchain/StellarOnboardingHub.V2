# StellarOnboardingHub
One super dApp. Gamified onboarding + seedless wallet. Learn Stellar, own Web3—fast, safe, anywhere.

# **Stellar Onboarding Hub – Hackathon Response**

# **1. Problem Statement**

### **What real-world problem are you solving?**

Blockchain adoption in Latin America remains limited because users lack simple tools, clear guidance in their native language, and straightforward experiences to learn and take their first onchain steps. Current activations are fragmented, manual, and lack real traceability of the impact they generate.

### **For whom is this a problem?**

- New users with no prior Web3 experience.  
- Universities, tech communities, and organizations that want to teach blockchain but lack structured systems.  
- Web3 ecosystems seeking measurable and scalable onboarding with verifiable data.  
- Web3 brands investing in events without being able to demonstrate real onchain impact.

### **Why is this urgent or important now?**

With the growth of the digital economy and the expansion of the Stellar ecosystem (especially with Soroban), there is an immediate need for tools that enable mass adoption through simple, measurable, and scalable processes. LATAM is a crucial market for remittances, micropayments, and Web3 education, yet lacks a standardized onboarding framework.

---

# **2. Target User and User Need**

### **Primary User**

Students, new Web3 users, and event attendees taking their first steps into blockchain.

### **Core Need / Pain Point**

- They need a clear, visual, and simple guide to create a wallet, learn the basics, and complete their first onchain action.  
- Organizations need to measure real onboarding, not just manual registrations or forms.

### **Current Alternatives**

- Scattered tutorials across social media.  
- Improvised explanations during events.  
- Manual processes using spreadsheets, Google Forms, or POAPs without real traceability.  

These alternatives are not scalable, not measurable, and create friction for new users.

---

# **3. Solution Overview**

## **3.1 Main Idea**

**Stellar Onboarding Hub** is a platform that centralizes, guides, and automates onboarding processes for events, communities, and universities. It offers a step-by-step visual flow for wallet creation, first onchain actions, rewards, and real-time traceability. The core is a gamified educational journey that transforms any beginner into an onchain user in under 5 minutes.

### **Core User Journey**

1. The user scans a QR code at an event.  
2. They enter the Onboarding Hub flow.  
3. They learn the basics and create their Stellar wallet.  
4. They complete their first onchain action (receive an asset, send a symbolic payment, claim a badge).  
5. Their progress is automatically registered for analytics and follow-up.  
6. They receive a digital or physical reward at the event.

---

## **3.2 Why Stellar?**

### **How Stellar helps**

Stellar provides:

- **Fast, low-cost, global payments**, ideal for educational micropayments.  
- **FX and remittances**, highly relevant use cases for LATAM.  
- **Anchors and stablecoins** for real-world demonstrations.  
- **Soroban smart contracts** to automate onboarding flows, tracking, badges, and rewards.

### **Stellar Components We Will Use**

- **Stellar Network** for payments and onchain actions.  
- **Stablecoins like USDC** depending on availability.  
- **Soroban** for tracking users, actions, and reward states.  
- **Stellar-compatible wallets** for user experience.  
- **Local anchors (if available)** for real remittance demonstrations.

---

# **4. Core Features (Planned for Hackathon)**

### **Feature 1 – Onboarding Flow UI**

A step-by-step visual flow for wallet creation, first transaction, and badge claim.  
**Validation:** User completes the flow without staff assistance.

### **Feature 2 – Soroban Contract for User Tracking**

A contract that registers completed actions (wallet creation, payment sent, badge claimed).  
**Validation:** Live dashboard with user metrics.

### **Feature 3 – Event QR System**

Dynamic QRs for each step, event, or onboarding station.  
**Validation:** Each QR logs an interaction on Soroban.

### **Stretch Goal – Rewards Engine**

An automated system for awarding badges, POAPs, or rewards based on user progress.  
**Validation:** Users redeem onchain rewards.

---

# **5. MVP Architecture (Initial Idea)**

### **Frontend**

- Next.js / React  
- Mobile-first  
- QR-friendly interface  

### **Smart Contracts (Soroban)**

- Module 1: User registry  
- Module 2: Onchain action registry  
- Module 3: Reward traceability (badges, points)

### **Data / Storage**

- Postgres for non-sensitive data (supabase) 
- IPFS for static educational content (optional)

### **Architecture Flow**

**User → Web UI → Backend → Soroban Contracts → Stellar Network**

---

# **6. Success Criteria for the Hackathon**

By the end of Stellar Hack+, our MVP will be successful if:

- [ ] A user can create a wallet and complete their first onchain action in under 5 minutes.  
- [ ] We can demonstrate full traceability of users and actions using Soroban.  
- [ ] We can measure real onboarding during a pilot event with at least 30–50 users.

---

# **7. Team**

### **Team Name**

**Stellar Onboarding Hub**

### **Members and Roles**

- **Fabio Anaya – Product Lead & Business Development**
- **Juan David Correa - Business Development**
- **Sergio Martinez – Smart Contracts (Soroban)** 
- **Alberto Vázquez – UX/UI Frontend Developer (Next.js)**
- **Jacqueline Sandoval - Business Development / Growth / IRL Activation**

