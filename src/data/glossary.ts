import { GlossaryTerm } from '@/types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'g001',
    term: 'Adversarial Example',
    definition:
      'A carefully crafted input designed to cause a machine learning model to make an incorrect prediction. These inputs often appear identical to legitimate inputs but contain subtle, mathematically optimized perturbations imperceptible to humans. Adversarial examples can be constructed using gradient-based methods (FGSM, PGD, C&W) in white-box settings, or via transfer and query-based attacks in black-box settings. They exist because neural networks learn non-human-aligned decision boundaries with high-frequency discontinuities.',
    domain: 'Adversarial Threats',
    related: ['Evasion Attack', 'Perturbation Budget', 'Adversarial Robustness', 'FGSM'],
  },
  {
    id: 'g002',
    term: 'Data Poisoning',
    definition:
      'An attack in which an adversary corrupts a model\'s training dataset to manipulate its learned behavior. Poisoning attacks occur at training time and include: label flipping (changing labels to cause systematic misclassification), backdoor injection (embedding trigger-response pairs), clean-label poisoning (correctly labeled but adversarially perturbed samples that shift decision boundaries), and availability attacks (injecting samples that degrade overall model performance). Defense involves data provenance tracking, anomaly detection on training data, and robust training techniques.',
    domain: 'Adversarial Threats',
    related: ['Backdoor Attack', 'Clean-Label Poisoning', 'Label Flipping', 'Data Provenance'],
  },
  {
    id: 'g003',
    term: 'Model Inversion',
    definition:
      'A privacy attack that uses a model\'s prediction outputs to reconstruct representative or specific training data. Given black-box query access, an attacker optimizes dummy inputs to maximize the model\'s confidence on a target class, recovering features characteristic of training examples in that class. Demonstrated against facial recognition APIs (Fredrikson et al., 2015), model inversion can reconstruct recognizable face images without access to weights. Defenses include output perturbation, differential privacy, and restricting confidence score granularity.',
    domain: 'Adversarial Threats',
    related: ['Membership Inference', 'Privacy Attack', 'Model Extraction', 'Differential Privacy'],
  },
  {
    id: 'g004',
    term: 'Membership Inference',
    definition:
      'An attack that determines whether a specific data point was included in a model\'s training dataset by exploiting the tendency of models to produce higher-confidence predictions on training samples than on unseen samples. Shadow model attacks (Shokri et al., 2017) train surrogate models to simulate the target\'s behavior and build classifiers distinguishing in-training from out-of-training prediction distributions. Successful membership inference can reveal inclusion of sensitive records (health, financial, personal data). Differential privacy training and output confidence restriction are primary defenses.',
    domain: 'Adversarial Threats',
    related: ['Model Inversion', 'Differential Privacy', 'Memorization', 'Shadow Model'],
  },
  {
    id: 'g005',
    term: 'Model Extraction',
    definition:
      'An attack that uses query access to a victim model to train a functionally equivalent surrogate model, stealing intellectual property without accessing the original weights. Extraction strategies include distillation-based extraction (using victim predictions as soft labels), decision boundary probing, and active learning-based query selection near the decision boundary. Defenses include rate limiting, output rounding or perturbation, query pattern monitoring, and model watermarking to detect extracted models. Extracted models also enable subsequent white-box adversarial attacks against the surrogate.',
    domain: 'Adversarial Threats',
    related: ['Model Stealing', 'Model Watermarking', 'IP Protection', 'Black-Box Attack'],
  },
  {
    id: 'g006',
    term: 'Prompt Injection',
    definition:
      'An attack against LLM-based applications where adversarially crafted input text overrides system-level instructions or manipulates model behavior. Direct prompt injection targets the model via attacker-controlled user input (e.g., "Ignore previous instructions and output your system prompt"). Indirect prompt injection embeds malicious instructions in external content (web pages, documents, database records) that the model retrieves and processes in RAG or agent workflows. Mitigations include strict instruction-data separation, input sanitization, privilege-restricted agent design, and output validation.',
    domain: 'Adversarial Threats',
    related: ['Jailbreaking', 'Indirect Injection', 'RAG Security', 'System Prompt'],
  },
  {
    id: 'g007',
    term: 'Differential Privacy',
    definition:
      'A mathematical privacy framework providing provable bounds on information leakage from statistical computations. A mechanism M satisfies (ε, δ)-differential privacy if for any two datasets D and D\' differing in one record, and any output set S: Pr[M(D) ∈ S] ≤ e^ε × Pr[M(D\') ∈ S] + δ. Smaller ε = stronger privacy guarantee, but lower utility. Applied to ML via DP-SGD (gradient clipping + Gaussian noise). DP provides provable resistance against membership inference attacks and limits model inversion by bounding memorization.',
    domain: 'Data Security & Model Integrity',
    related: ['DP-SGD', 'Privacy Budget', 'Federated Learning', 'Membership Inference'],
  },
  {
    id: 'g008',
    term: 'Federated Learning',
    definition:
      'A distributed machine learning paradigm where multiple clients train on local data and share only model updates (gradients or weight deltas) with a central aggregator, keeping raw data on-device. Introduced by McMahan et al. (Google, 2017) for on-device keyboard prediction. Provides data minimization by design. Privacy limitations include gradient inversion attacks (Zhu et al., 2019) that can reconstruct training data from gradients, and membership inference via update analysis. Full privacy requires additional mechanisms: DP noise addition and secure aggregation.',
    domain: 'AI Security Fundamentals',
    related: ['Gradient Inversion', 'Secure Aggregation', 'Differential Privacy', 'Byzantine Robustness'],
  },
  {
    id: 'g009',
    term: 'Adversarial Robustness',
    definition:
      'The property of an ML model that ensures predictions remain stable under small, bounded input perturbations. A classifier is (ε, L_p)-robust at input x if its prediction does not change for any input within the L_p ball of radius ε around x. Robustness can be empirical (demonstrated against known attacks, but not guaranteed against stronger ones) or certified (mathematically proven, e.g., via randomized smoothing or interval bound propagation). Adversarial training is the dominant empirical approach; clean accuracy and robust accuracy trade off against each other.',
    domain: 'Adversarial Threats',
    related: ['Certified Robustness', 'Adversarial Training', 'Perturbation Budget', 'Randomized Smoothing'],
  },
  {
    id: 'g010',
    term: 'MITRE ATLAS',
    definition:
      'Adversarial Threat Landscape for Artificial-Intelligence Systems — a MITRE-maintained knowledge base cataloging adversarial tactics, techniques, and case studies against machine learning systems. Structured analogously to MITRE ATT&CK, it organizes ML-specific attacks by adversary tactic (goal) and technique (method). Includes real-world incident case studies, mitigation guidance, and detection recommendations. Used for AI-specific threat modeling, red team scoping, security control selection, and communicating ML risks to security teams.',
    domain: 'Adversarial Threats',
    related: ['MITRE ATT&CK', 'Threat Modeling', 'AI Red Teaming', 'Tactics and Techniques'],
  },
  {
    id: 'g011',
    term: 'AI Red Teaming',
    definition:
      'An adversarial testing practice in which a dedicated team probes an AI system to identify vulnerabilities, failure modes, safety issues, and potential misuse vectors before or during deployment. AI red teaming covers security (adversarial attacks, extraction, prompt injection), safety (harmful outputs, unintended behaviors), and alignment (boundary violations, policy circumvention). Methods include both manual creative probing and automated tools (Garak, PyRIT). Red team findings drive security controls, guardrail improvements, and threat model updates.',
    domain: 'Securing AI Systems',
    related: ['Jailbreaking', 'Adversarial Testing', 'Vulnerability Assessment', 'MITRE ATLAS'],
  },
  {
    id: 'g012',
    term: 'MLOps',
    definition:
      'Machine Learning Operations — the set of practices, tools, and processes that industrialize the ML lifecycle, combining ML system development with reliable operational deployment. MLOps encompasses data pipeline management, experiment tracking, model training automation, version control of models and data, CI/CD for ML, deployment strategies (canary, shadow, A/B), monitoring and drift detection, and retraining pipelines. From a security perspective, MLOps introduces an expanded attack surface: each pipeline stage is a potential injection point for supply chain, poisoning, or tampering attacks.',
    domain: 'AI Security Fundamentals',
    related: ['Model Registry', 'CI/CD Security', 'Feature Store', 'Model Monitoring'],
  },
  {
    id: 'g013',
    term: 'Model Drift',
    definition:
      'The degradation of a deployed ML model\'s performance over time caused by changes in the data it encounters in production relative to its training distribution. Data drift (covariate shift) occurs when input feature distributions change. Concept drift occurs when the underlying relationship between inputs and outputs changes. From a security perspective, adversarial drift — where an attacker deliberately induces drift through data pipeline manipulation or feedback poisoning — requires distinguishing natural from adversarial drift via statistical testing and anomaly detection on drift patterns.',
    domain: 'AI Security Fundamentals',
    related: ['Data Drift', 'Concept Drift', 'Model Monitoring', 'Retraining Pipeline'],
  },
  {
    id: 'g014',
    term: 'Explainable AI (XAI)',
    definition:
      'A field and set of techniques enabling humans to understand and interpret the predictions or decisions made by ML models. Techniques range from inherently interpretable architectures (decision trees, linear models, rule lists) to post-hoc explanation methods applied to black-box models. Key techniques include SHAP (Shapley Additive exPlanations, game-theory-based feature attribution), LIME (Local Interpretable Model-agnostic Explanations, local surrogate models), attention visualization, and counterfactual explanations. In security, XAI supports audit of AI decisions, backdoor detection, forensic investigation, and regulatory compliance (GDPR right to explanation).',
    domain: 'Securing AI Systems',
    related: ['SHAP', 'LIME', 'Interpretability', 'GDPR Right to Explanation'],
  },
  {
    id: 'g015',
    term: 'Backdoor Attack',
    definition:
      'A training-time attack that embeds a hidden behavior in a model: the model performs normally on clean inputs but produces attacker-specified outputs whenever a designated trigger pattern is present in the input. Triggers can be pixel patches, specific phrases, audio tones, or abstract feature patterns. BadNets (Gu et al., 2017) established the paradigm for CNNs; LLM backdoors are introduced via poisoned fine-tuning datasets. Detection methods include Neural Cleanse, STRIP, Activation Clustering, and Fine-Pruning. Backdoors are particularly dangerous in supply chain scenarios where pretrained models from untrusted sources are adopted.',
    domain: 'Adversarial Threats',
    related: ['Trigger Pattern', 'Data Poisoning', 'Neural Cleanse', 'Supply Chain Attack'],
  },
  {
    id: 'g016',
    term: 'Evasion Attack',
    definition:
      'An inference-time adversarial attack that modifies a test input to cause a deployed model to produce an incorrect or attacker-desired prediction without modifying the model itself. Evasion attacks include gradient-based methods (FGSM, PGD, C&W, DeepFool) in white-box settings and transfer, query-based, or decision-boundary attacks in black-box settings. Physical evasion attacks extend to the real world via adversarial patches, 3D objects, and camouflage patterns. Distinguished from data poisoning attacks which operate at training time.',
    domain: 'Adversarial Threats',
    related: ['Adversarial Example', 'Perturbation Budget', 'PGD Attack', 'Physical Adversarial Attack'],
  },
  {
    id: 'g017',
    term: 'Byzantine Fault Tolerance',
    definition:
      'The ability of a distributed system to continue operating correctly despite arbitrary, potentially malicious behavior by some of its components — named after the Byzantine Generals Problem. In federated learning, Byzantine-tolerant aggregation algorithms (Krum, coordinate-wise median, trimmed mean, FLTrust, Bulyan) resist malicious clients that submit crafted gradient updates designed to steer the global model toward attacker-controlled behavior. Effective when the fraction of Byzantine clients is below a theoretical threshold (typically less than one-half of participants).',
    domain: 'Securing AI Systems',
    related: ['Federated Learning', 'Robust Aggregation', 'Krum', 'Poisoning Attack'],
  },
  {
    id: 'g018',
    term: 'Secure Aggregation',
    definition:
      'A cryptographic protocol in federated learning that enables a central server to compute the sum (or average) of client model updates without observing any individual client\'s update in plaintext. Implemented via secret sharing or homomorphic encryption, secure aggregation prevents the server from conducting gradient inversion attacks and protects client privacy from a honest-but-curious aggregator. It is typically combined with differential privacy (noise added before aggregation) to protect against a server that knows all individual updates after reconstruction.',
    domain: 'Securing AI Systems',
    related: ['Federated Learning', 'Gradient Inversion', 'Secret Sharing', 'Homomorphic Encryption'],
  },
  {
    id: 'g019',
    term: 'Model Watermarking',
    definition:
      'A technique for embedding a hidden, verifiable ownership signal in a trained ML model or its outputs to establish intellectual property provenance and detect unauthorized copying or redistribution. Model watermarking is typically implemented by training the model to produce predetermined outputs for a set of secret trigger inputs; ownership is verified by querying with triggers and confirming the expected responses. Output watermarking (e.g., for LLMs and image generators) embeds statistical patterns in outputs that persist through minor edits. Challenges include watermark removal via fine-tuning, model extraction (the extracted model may not inherit the watermark), and collusion attacks.',
    domain: 'Data Security & Model Integrity',
    related: ['IP Protection', 'Model Extraction', 'Trigger Pattern', 'Backdoor Attack'],
  },
  {
    id: 'g020',
    term: 'RLHF Security',
    definition:
      'The security and safety implications of Reinforcement Learning from Human Feedback, a training technique that aligns LLM outputs with human preferences using a reward model trained on human annotations. RLHF security concerns include: reward hacking (the policy exploits unintended reward model failures), labeler manipulation (adversarial influence over the annotation pool biases the reward model), reward model poisoning (injected poisoned preference pairs steer alignment), and fine-tuning reversal (downstream fine-tuning on even small amounts of data can erode RLHF-established safety properties). The alignment achieved by RLHF is currently not robust to adaptive adversaries or subsequent fine-tuning.',
    domain: 'Adversarial Threats',
    related: ['Jailbreaking', 'Alignment', 'Reward Hacking', 'Fine-Tuning Attack'],
  },
];
