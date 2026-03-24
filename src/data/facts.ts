import { StudyFact } from '@/types';

export const studyFacts: StudyFact[] = [
  // ── FACTS (20) ────────────────────────────────────────────────────────────
  {
    id: 'sf001',
    type: 'fact',
    content:
      'The MITRE ATLAS framework specifically catalogs adversarial tactics and techniques against machine learning systems, analogous to how MITRE ATT&CK covers traditional cyber threats. It includes real-world case studies of attacks against deployed AI systems and maps each technique to mitigations.',
    domain: 'Adversarial Threats',
    tags: ['mitre-atlas', 'framework', 'taxonomy'],
  },
  {
    id: 'sf002',
    type: 'fact',
    content:
      'DP-SGD (Differentially Private SGD) was formally introduced by Abadi et al. at Google in 2016. It uses per-sample gradient clipping and calibrated Gaussian noise to provide (ε, δ)-differential privacy guarantees for neural network training — a foundational technique used in production at companies like Apple and Google for on-device learning.',
    domain: 'Data Security & Model Integrity',
    tags: ['differential-privacy', 'dp-sgd', 'history'],
  },
  {
    id: 'sf003',
    type: 'fact',
    content:
      'The Carlini & Wagner (C&W) attack, published in 2017, demonstrated that many popular adversarial example defenses at the time — including distillation, feature squeezing, and input transformations — could be defeated by an adaptive attacker who accounts for the defense in the attack formulation. This established the principle that defenses must be evaluated against adaptive attacks.',
    domain: 'Adversarial Threats',
    tags: ['carlini-wagner', 'adaptive-attacks', 'evaluation'],
  },
  {
    id: 'sf004',
    type: 'fact',
    content:
      'The EU AI Act classifies AI-powered real-time remote biometric identification systems used in public spaces for law enforcement as unacceptable risk, making them prohibited by default (with narrow exceptions). This is one of the few absolute prohibitions in the regulation rather than a managed high-risk category.',
    domain: 'AI Governance & Compliance',
    tags: ['eu-ai-act', 'biometric', 'prohibited'],
  },
  {
    id: 'sf005',
    type: 'fact',
    content:
      'Model inversion attacks were demonstrated against a commercial facial recognition API by Fredrikson et al. in 2015. Using only black-box query access and knowledge of a target individual\'s name, they reconstructed recognizable face images of people in the training set — despite never having access to model weights.',
    domain: 'Adversarial Threats',
    tags: ['model-inversion', 'facial-recognition', 'privacy'],
  },
  {
    id: 'sf006',
    type: 'fact',
    content:
      'Gradient inversion (DLG attack, Zhu et al. 2019) showed that a single batch of gradients shared in federated learning can be used to reconstruct training images with near-pixel-perfect fidelity. The attack requires only the gradient tensor and model architecture — no access to the raw data or other clients\' updates.',
    domain: 'Data Security & Model Integrity',
    tags: ['gradient-inversion', 'federated-learning', 'privacy'],
  },
  {
    id: 'sf007',
    type: 'fact',
    content:
      'The GCG (Greedy Coordinate Gradient) attack by Zou et al. (2023) demonstrated that adversarial suffixes appended to prompts can reliably jailbreak aligned LLMs including ChatGPT, Claude, and Gemini. The attack is largely automated and transfers across models, raising serious concerns about the robustness of RLHF-based safety training.',
    domain: 'Adversarial Threats',
    tags: ['gcg', 'jailbreaking', 'llm-safety'],
  },
  {
    id: 'sf008',
    type: 'fact',
    content:
      'The Python pickle format — used by PyTorch\'s default torch.save/torch.load — executes arbitrary Python code during deserialization. This means a malicious model file downloaded from an untrusted hub can achieve remote code execution simply by loading the model. The SafeTensors format was created specifically to address this vulnerability.',
    domain: 'Data Security & Model Integrity',
    tags: ['pickle', 'rce', 'safetensors', 'supply-chain'],
  },
  {
    id: 'sf009',
    type: 'fact',
    content:
      'EPSS (Exploit Prediction Scoring System), maintained by FIRST.org, uses ML to predict the probability that a CVE will be exploited in the wild within 30 days. Studies have shown EPSS outperforms CVSS severity scores for prioritizing which vulnerabilities to patch first, demonstrating a positive security application of AI.',
    domain: 'AI in Security Operations',
    tags: ['epss', 'vulnerability-management', 'cvss'],
  },
  {
    id: 'sf010',
    type: 'fact',
    content:
      'Randomized smoothing (Cohen et al., 2019) provides the first practical, scalable certification scheme for large neural networks. Unlike prior certified defenses that required specially designed architectures, randomized smoothing works with any base classifier and scales to ImageNet-class models, though at a cost to clean accuracy.',
    domain: 'Securing AI Systems',
    tags: ['randomized-smoothing', 'certified-robustness', 'certification'],
  },
  {
    id: 'sf011',
    type: 'fact',
    content:
      'The NIST AI RMF was released in January 2023 after a multi-year collaborative process involving more than 240 organizations. Unlike a compliance standard, it is voluntary and designed to be technology-agnostic and sector-neutral, providing a flexible structure that organizations can adapt to their specific context.',
    domain: 'AI Governance & Compliance',
    tags: ['nist-ai-rmf', 'history', 'voluntary'],
  },
  {
    id: 'sf012',
    type: 'fact',
    content:
      'Membership inference attacks are more effective against models that overfit — overfitted models memorize training data more aggressively, causing a larger gap between their confidence on training samples versus test samples. Regularization techniques (dropout, L2 weight decay, early stopping) that reduce overfitting also reduce membership inference vulnerability as a side effect.',
    domain: 'Adversarial Threats',
    tags: ['membership-inference', 'overfitting', 'regularization'],
  },
  {
    id: 'sf013',
    type: 'fact',
    content:
      'The BadNets paper (Gu et al., 2017) first demonstrated backdoor attacks on neural networks. A model trained on a dataset with stamped trigger patterns (small sunglasses pixels on stop sign images) would classify any stop sign with the trigger as a speed limit sign, while performing normally on clean images.',
    domain: 'Adversarial Threats',
    tags: ['backdoor', 'badnets', 'autonomous-vehicles'],
  },
  {
    id: 'sf014',
    type: 'fact',
    content:
      'ISO/IEC 42001:2023 is the first internationally standardized, certifiable AI management system standard. It follows the same High Level Structure as ISO 27001 (information security) and ISO 9001 (quality management), enabling organizations that already hold those certifications to extend their management systems to cover AI risk.',
    domain: 'AI Governance & Compliance',
    tags: ['iso-42001', 'certification', 'management-system'],
  },
  {
    id: 'sf015',
    type: 'fact',
    content:
      'The concept of adversarial examples was first published by Szegedy et al. (2013), who noticed that small imperceptible perturbations to ImageNet images caused deep neural networks to make wildly incorrect predictions with high confidence — labeling a panda as a gibbon with 99.3% confidence after a barely perceptible perturbation.',
    domain: 'Adversarial Threats',
    tags: ['adversarial-examples', 'history', 'imagenet'],
  },
  {
    id: 'sf016',
    type: 'fact',
    content:
      'Intel SGX (Software Guard Extensions), one of the most widely deployed Trusted Execution Environments, has been the subject of numerous side-channel attacks including Spectre, Meltdown, SGAxe, and CacheOut. These attacks demonstrate that hardware-level isolation does not eliminate all security risks for ML workloads running inside enclaves.',
    domain: 'Securing AI Systems',
    tags: ['sgx', 'tee', 'side-channel'],
  },
  {
    id: 'sf017',
    type: 'fact',
    content:
      'Federated learning was introduced by McMahan et al. at Google in 2017, initially for training next-word prediction models on Android keyboards. The key insight was that model updates (gradients) are much smaller than the training data and contain far less private information — though subsequent gradient inversion research challenged this assumption.',
    domain: 'AI Security Fundamentals',
    tags: ['federated-learning', 'history', 'google'],
  },
  {
    id: 'sf018',
    type: 'fact',
    content:
      'The concept of "sponge attacks" (Shumailov et al., 2021) demonstrated that adversarial inputs can be crafted to maximize energy consumption and inference latency on both CPUs and GPUs — slowing BERT inference by up to 6x and increasing energy usage by over 500x — enabling availability attacks without causing misclassification.',
    domain: 'Adversarial Threats',
    tags: ['sponge-attacks', 'availability', 'dos'],
  },
  {
    id: 'sf019',
    type: 'fact',
    content:
      'The EU AI Act applies extraterritorially: non-EU companies whose AI systems are placed on the EU market, used in the EU, or whose outputs affect people in the EU are subject to its requirements. This mirrors the GDPR\'s extraterritorial scope and means US and Asian AI providers serving EU customers must comply.',
    domain: 'AI Governance & Compliance',
    tags: ['eu-ai-act', 'extraterritorial', 'compliance'],
  },
  {
    id: 'sf020',
    type: 'fact',
    content:
      'Clean-label poisoning attacks (Turner et al., 2019) require no modification of training labels — all poison samples are correctly labeled — yet still enable targeted misclassification of specific test inputs. This makes them undetectable by data quality checks that rely on label accuracy, representing a more sophisticated supply chain threat than label-flipping attacks.',
    domain: 'Adversarial Threats',
    tags: ['clean-label-poisoning', 'supply-chain', 'stealthy'],
  },

  // ── MYTHS (15) ────────────────────────────────────────────────────────────
  {
    id: 'sf021',
    type: 'myth',
    content:
      'MYTH: Encrypting model weights fully protects against model theft attacks. In reality, model stealing (extraction) attacks work entirely through black-box query access to the model\'s prediction API — the attacker never needs to access weights. They train a functionally equivalent surrogate by querying the victim API and using its outputs as training labels.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['model-stealing', 'encryption', 'black-box'],
  },
  {
    id: 'sf022',
    type: 'myth',
    content:
      'MYTH: Differential privacy makes a model completely private. Differential privacy provides a bounded probabilistic guarantee that limits information leakage — it does not make the model perfectly private. With a privacy budget ε > 0, some information leakage is still permitted. Very large ε values (e.g., ε = 100) offer essentially no meaningful privacy protection despite technically satisfying the DP definition.',
    domain: 'Data Security & Model Integrity',
    isMythTrue: false,
    tags: ['differential-privacy', 'misconception', 'privacy-budget'],
  },
  {
    id: 'sf023',
    type: 'myth',
    content:
      'MYTH: Federated learning inherently prevents privacy leakage. Federated learning prevents raw data from leaving the client, but gradient updates can still leak training data through gradient inversion attacks. Additionally, participation in federated rounds itself reveals membership information. FL is a privacy-improving technique, not a privacy-guaranteeing one, without additional mechanisms like DP and secure aggregation.',
    domain: 'AI Security Fundamentals',
    isMythTrue: false,
    tags: ['federated-learning', 'privacy-misconception'],
  },
  {
    id: 'sf024',
    type: 'myth',
    content:
      'MYTH: Adding randomness to model outputs (e.g., temperature sampling, output rounding) is sufficient to prevent model extraction. Randomness increases the query budget required for extraction but does not prevent it. Techniques like knockoff nets and functionally equivalent extraction can still succeed with more queries. Effective extraction resistance requires combining output perturbation with rate limiting and query pattern detection.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['model-extraction', 'randomness', 'defense'],
  },
  {
    id: 'sf025',
    type: 'myth',
    content:
      'MYTH: A model\'s safety training from RLHF is permanent and cannot be undone. Fine-tuning an RLHF-aligned model on even a small amount of new data can degrade or remove safety behaviors. Research has demonstrated that safety fine-tuning can be reversed with as few as 100 harmful examples, and even benign fine-tuning on task-specific data can erode safety properties as a side effect.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['rlhf', 'fine-tuning', 'safety'],
  },
  {
    id: 'sf026',
    type: 'myth',
    content:
      'MYTH: A model that performs well on clean test data must also be robust to adversarial inputs. These are independent properties. Many models with >95% clean accuracy have near-zero adversarial accuracy under modest perturbation budgets. Robustness requires explicit training for adversarial robustness; clean accuracy alone is not a proxy for it.',
    domain: 'Securing AI Systems',
    isMythTrue: false,
    tags: ['clean-accuracy', 'adversarial-robustness', 'misconception'],
  },
  {
    id: 'sf027',
    type: 'myth',
    content:
      'MYTH: Obfuscating or keeping a model architecture secret provides meaningful security (security through obscurity). While black-box conditions do require more queries, architecture and hyperparameters can often be inferred through systematic probing. Adversarial robustness, access controls, and monitoring provide genuine security; secrecy of architecture is not a reliable primary defense.',
    domain: 'Securing AI Systems',
    isMythTrue: false,
    tags: ['security-through-obscurity', 'defense', 'architecture'],
  },
  {
    id: 'sf028',
    type: 'myth',
    content:
      'MYTH: Adversarial examples only work in digital domains and are not a real-world threat. Physical adversarial attacks have been demonstrated with adversarial patches printed on paper, adversarial 3D objects recognized incorrectly from all angles, adversarial stop sign stickers that fool autonomous vehicle classifiers, and adversarial glasses that defeat facial recognition. Physical deployability is a real and demonstrated threat.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['physical-adversarial', 'real-world', 'threat'],
  },
  {
    id: 'sf029',
    type: 'myth',
    content:
      'MYTH: Prompt injection can always be prevented by instructing the model not to follow injected instructions. This is ineffective because LLMs process all text in context using the same mechanism — there is no hardware-enforced separation between trusted instructions and untrusted data. Robust defenses require architectural changes: separate processing pipelines for untrusted content, privilege-restricted execution, and output validation layers.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['prompt-injection', 'llm', 'defense-misconception'],
  },
  {
    id: 'sf030',
    type: 'myth',
    content:
      'MYTH: Smaller, less capable AI models do not need robust security controls. Smaller models can still be vulnerable to membership inference, model extraction, and adversarial inputs proportional to their capabilities. Models used in high-stakes decisions (credit scoring, medical diagnosis) require strong security regardless of size. The risk is determined by the deployment context, not model complexity.',
    domain: 'AI Security Fundamentals',
    isMythTrue: false,
    tags: ['small-models', 'security-controls', 'risk'],
  },
  {
    id: 'sf031',
    type: 'myth',
    content:
      'MYTH: The EU AI Act only applies to AI developers. The Act applies to both providers (developers who place AI systems on the market or put them into service) and deployers (organizations that use AI systems in a professional context). Deployers of high-risk AI systems have their own set of obligations including human oversight, monitoring, and ensuring proper use within the provider\'s defined intended purpose.',
    domain: 'AI Governance & Compliance',
    isMythTrue: false,
    tags: ['eu-ai-act', 'deployers', 'providers'],
  },
  {
    id: 'sf032',
    type: 'myth',
    content:
      'MYTH: Data poisoning attacks require large amounts of poisoned data to be effective. Clean-label backdoor attacks and targeted gradient-based poisoning attacks have demonstrated that injecting as little as 0.1% poisoned samples into a training dataset can achieve high-confidence targeted misclassification. The effectiveness depends on the attack sophistication, not just volume.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['data-poisoning', 'small-fraction', 'clean-label'],
  },
  {
    id: 'sf033',
    type: 'myth',
    content:
      'MYTH: AI models used only internally (not exposed via public API) are not at risk from adversarial attacks. Insider threats, supply chain compromises, and indirect adversarial attacks through data pipelines still apply to internal models. Federated learning attacks, training data poisoning, and model tampering during deployment are all feasible without external API access.',
    domain: 'Securing AI Systems',
    isMythTrue: false,
    tags: ['internal-models', 'insider-threat', 'misconception'],
  },
  {
    id: 'sf034',
    type: 'myth',
    content:
      'MYTH: RLHF-aligned LLMs cannot be jailbroken with sufficient alignment training. No current LLM has demonstrated jailbreak resistance that scales with model capability or alignment budget. Research (Zou et al. 2023, Wallace et al.) shows that universal adversarial suffixes reliably elicit harmful outputs from the most aligned publicly available models. Safety and capability are currently in tension with no known complete solution.',
    domain: 'Adversarial Threats',
    isMythTrue: false,
    tags: ['rlhf', 'jailbreaking', 'alignment'],
  },
  {
    id: 'sf035',
    type: 'myth',
    content:
      'MYTH: Model drift is always a natural phenomenon caused by legitimate data distribution changes. While natural drift is common, adversarial drift — where an attacker gradually manipulates feedback loops, training data pipelines, or deployed model inputs to steer model behavior — is also possible. Unusual drift patterns (directional drift in specific decision classes, synchronized drift across models) should be investigated as potential security events, not assumed to be benign.',
    domain: 'Data Security & Model Integrity',
    isMythTrue: false,
    tags: ['model-drift', 'adversarial-drift', 'monitoring'],
  },

  // ── TIPS (15) ─────────────────────────────────────────────────────────────
  {
    id: 'sf036',
    type: 'tip',
    content:
      'EXAM TIP: When a question mentions "model behavior changes after deployment with no code changes," think data drift, adversarial input campaign, or feedback loop poisoning — not a software bug. Code hasn\'t changed, but model behavior has, which points to data-layer issues.',
    domain: 'AI Security Fundamentals',
    tags: ['exam-tip', 'model-drift', 'debugging'],
  },
  {
    id: 'sf037',
    type: 'tip',
    content:
      'EXAM TIP: Distinguish training-time from inference-time attacks. Data poisoning, backdoor injection, and supply chain attacks happen at training time. Adversarial examples, model extraction, prompt injection, and evasion attacks happen at inference time. Questions about "attack during deployment" point to inference-time techniques.',
    domain: 'Adversarial Threats',
    tags: ['exam-tip', 'training-vs-inference', 'classification'],
  },
  {
    id: 'sf038',
    type: 'tip',
    content:
      'EXAM TIP: For the NIST AI RMF, remember the order of functions as GOVERN → MAP → MEASURE → MANAGE, and that GOVERN is the foundation that underlies all others. "Govern first" — without organizational governance and policy, the other functions lack accountability.',
    domain: 'AI Governance & Compliance',
    tags: ['exam-tip', 'nist-ai-rmf', 'functions'],
  },
  {
    id: 'sf039',
    type: 'tip',
    content:
      'EXAM TIP: When asked about protecting model weights confidentiality during inference (e.g., a client sends data to a server but neither wants to reveal their secret), think Trusted Execution Environments (TEEs/enclaves) or Homomorphic Encryption — not standard TLS, which only protects data in transit, not during computation.',
    domain: 'Securing AI Systems',
    tags: ['exam-tip', 'tee', 'homomorphic-encryption', 'inference-privacy'],
  },
  {
    id: 'sf040',
    type: 'tip',
    content:
      'EXAM TIP: Differential privacy epsilon (ε) and utility have an inverse relationship. Smaller ε = stronger privacy but lower model accuracy. Larger ε = weaker privacy but better utility. When a question asks which configuration is "more privacy-preserving," choose the smaller ε value.',
    domain: 'Data Security & Model Integrity',
    tags: ['exam-tip', 'differential-privacy', 'epsilon'],
  },
  {
    id: 'sf041',
    type: 'tip',
    content:
      'EXAM TIP: The EU AI Act risk tier order from highest to lowest risk is: Prohibited (banned outright) → High Risk (conformity assessment required) → Limited Risk (transparency obligations) → Minimal Risk (no mandatory requirements). Real-time biometric surveillance is Prohibited; hiring AI and credit scoring are High Risk.',
    domain: 'AI Governance & Compliance',
    tags: ['exam-tip', 'eu-ai-act', 'risk-tiers'],
  },
  {
    id: 'sf042',
    type: 'tip',
    content:
      'EXAM TIP: When distinguishing model inversion from membership inference: model inversion recovers representative training data (reconstructs images, features), while membership inference answers a yes/no question about whether a specific sample was in the training set. Both exploit model memorization but have different outputs and threat models.',
    domain: 'Adversarial Threats',
    tags: ['exam-tip', 'model-inversion', 'membership-inference'],
  },
  {
    id: 'sf043',
    type: 'tip',
    content:
      'EXAM TIP: Federated learning defenses form a layered stack — these layers are often tested together. Gradient clipping + Gaussian noise = DP-SGD. Secure aggregation prevents the server from seeing individual gradients. Byzantine-robust aggregation (Krum, trimmed mean) handles malicious clients. Knowing which layer addresses which threat is key.',
    domain: 'Securing AI Systems',
    tags: ['exam-tip', 'federated-learning', 'defense-layers'],
  },
  {
    id: 'sf044',
    type: 'tip',
    content:
      'EXAM TIP: For questions about detecting adversarial inputs at inference time without retraining the model, the three primary techniques are: feature squeezing (compare predictions on original vs. smoothed inputs), input distribution monitoring (flag out-of-distribution inputs), and ensemble disagreement (divergent predictions signal adversarial inputs).',
    domain: 'Securing AI Systems',
    tags: ['exam-tip', 'adversarial-detection', 'inference-time'],
  },
  {
    id: 'sf045',
    type: 'tip',
    content:
      'EXAM TIP: MITRE ATLAS is for ML-specific attacks; MITRE ATT&CK is for traditional cyberattacks. If a question asks about frameworks for mapping adversarial ML techniques and tactics, it\'s ATLAS. If it\'s about enterprise intrusion TTPs, it\'s ATT&CK. They are complementary and can be used together in AI system threat modeling.',
    domain: 'AI Security Fundamentals',
    tags: ['exam-tip', 'mitre-atlas', 'mitre-attck'],
  },
  {
    id: 'sf046',
    type: 'tip',
    content:
      'EXAM TIP: Backdoor attacks have two defining characteristics: (1) normal performance on clean inputs, and (2) attacker-controlled misclassification on trigger-bearing inputs. If a scenario describes a model that works correctly except when a specific pattern is present, it\'s describing a backdoor, not a general adversarial example attack.',
    domain: 'Adversarial Threats',
    tags: ['exam-tip', 'backdoor', 'triggers'],
  },
  {
    id: 'sf047',
    type: 'tip',
    content:
      'EXAM TIP: The key difference between shadow mode and canary deployment is exposure: shadow mode has zero user impact (the new model never serves real responses); canary deployment serves a small percentage of real users with the new model. Shadow mode = pure observation; canary = controlled real-world validation.',
    domain: 'AI Security Fundamentals',
    tags: ['exam-tip', 'shadow-mode', 'canary-deployment'],
  },
  {
    id: 'sf048',
    type: 'tip',
    content:
      'EXAM TIP: When a question asks about protecting individual user data in federated learning while also defending against malicious clients, the answer requires two separate mechanisms: differential privacy (for user privacy) + Byzantine-robust aggregation (for malicious client defense). Neither alone addresses both threats.',
    domain: 'Securing AI Systems',
    tags: ['exam-tip', 'federated-learning', 'combined-defenses'],
  },
  {
    id: 'sf049',
    type: 'tip',
    content:
      'EXAM TIP: For XAI questions, remember the key distinction: SHAP gives global and local feature importance with theoretical guarantees (Shapley values from game theory); LIME gives local approximations by fitting a simple model in the neighborhood of a prediction. SHAP is more theoretically rigorous; LIME is more computationally flexible for black-box models.',
    domain: 'Securing AI Systems',
    tags: ['exam-tip', 'xai', 'shap', 'lime'],
  },
  {
    id: 'sf050',
    type: 'tip',
    content:
      'STUDY TIP: When studying the NIST AI RMF, map each function to a lifecycle phase: Govern = across all phases (policy and culture), Map = before and during development (identify risks), Measure = during development and after deployment (test and monitor), Manage = during operation (respond and improve). This temporal framing helps distinguish the functions on exam questions.',
    domain: 'AI Governance & Compliance',
    tags: ['study-tip', 'nist-ai-rmf', 'lifecycle'],
  },

  // ── TERMS (15) ────────────────────────────────────────────────────────────
  {
    id: 'sf051',
    type: 'term',
    content:
      'Membership Inference Attack: An attack that determines whether a specific data point was included in a model\'s training dataset. It exploits the tendency of trained models to produce higher confidence scores for training samples than unseen test samples, potentially revealing that sensitive records (medical, financial, personal) were used for training.',
    domain: 'Adversarial Threats',
    tags: ['membership-inference', 'privacy', 'definition'],
  },
  {
    id: 'sf052',
    type: 'term',
    content:
      'Adversarial Robustness: The property of an ML model that ensures its predictions remain stable when inputs are subjected to small, bounded perturbations. A model is considered robust within a perturbation radius ε under a specified norm (L∞, L2, L1) if no perturbation within that ball changes the predicted class.',
    domain: 'Adversarial Threats',
    tags: ['adversarial-robustness', 'definition', 'perturbation'],
  },
  {
    id: 'sf053',
    type: 'term',
    content:
      'Model Watermarking: A technique for embedding a hidden, verifiable signal in a machine learning model to establish ownership. Implemented by training the model to produce specific predetermined outputs for a set of secret trigger inputs, enabling the owner to prove ownership through a verification protocol without revealing the full model.',
    domain: 'Data Security & Model Integrity',
    tags: ['watermarking', 'ip-protection', 'definition'],
  },
  {
    id: 'sf054',
    type: 'term',
    content:
      'Byzantine Fault Tolerance: In distributed systems, the ability to continue operating correctly despite arbitrary (potentially malicious) failures of some components. In federated learning, Byzantine-tolerant aggregation algorithms resist malicious clients that send crafted gradient updates designed to poison the global model.',
    domain: 'Securing AI Systems',
    tags: ['byzantine-fault-tolerance', 'federated-learning', 'definition'],
  },
  {
    id: 'sf055',
    type: 'term',
    content:
      'Data Poisoning: An attack on machine learning systems that corrupts the training dataset to manipulate the learned model\'s behavior. Variants include label flipping (changing labels), backdoor injection (embedding trigger-response pairs), clean-label poisoning (correctly labeled but adversarially perturbed samples), and availability attacks (degrading overall model performance).',
    domain: 'Adversarial Threats',
    tags: ['data-poisoning', 'definition', 'training-time'],
  },
  {
    id: 'sf056',
    type: 'term',
    content:
      'Differential Privacy (DP): A mathematical privacy framework that bounds the influence of any single individual\'s data on the output of a computation. Formally, a mechanism M satisfies (ε, δ)-DP if for datasets differing in one record, the probability of any output changes by at most a factor of e^ε, with failure probability δ.',
    domain: 'Data Security & Model Integrity',
    tags: ['differential-privacy', 'definition', 'formal'],
  },
  {
    id: 'sf057',
    type: 'term',
    content:
      'Evasion Attack: An inference-time adversarial attack that modifies a test input to cause a deployed model to produce an incorrect prediction. Unlike poisoning attacks, evasion attacks do not modify the model or its training data — they craft inputs that exploit the model\'s existing decision boundaries to produce attacker-desired misclassifications.',
    domain: 'Adversarial Threats',
    tags: ['evasion', 'inference-time', 'definition'],
  },
  {
    id: 'sf058',
    type: 'term',
    content:
      'Secure Aggregation: A cryptographic protocol in federated learning that allows a central server to compute the sum of clients\' model updates without seeing any individual update in plaintext. Typically implemented using secret sharing or homomorphic encryption, it prevents the server from conducting gradient inversion attacks on individual clients.',
    domain: 'Securing AI Systems',
    tags: ['secure-aggregation', 'federated-learning', 'cryptography', 'definition'],
  },
  {
    id: 'sf059',
    type: 'term',
    content:
      'MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems): A MITRE-maintained knowledge base of adversarial tactics, techniques, and real-world case studies targeting AI and ML systems. Structured analogously to ATT&CK, it enables threat modeling, red team planning, and security control selection for AI system defenders.',
    domain: 'Adversarial Threats',
    tags: ['mitre-atlas', 'definition', 'framework'],
  },
  {
    id: 'sf060',
    type: 'term',
    content:
      'Model Drift: The degradation of a deployed machine learning model\'s performance over time due to changes in the data distribution it encounters in production. Data drift refers to changes in input feature distributions; concept drift refers to changes in the relationship between inputs and outputs. Both can result from natural environmental change or adversarial manipulation.',
    domain: 'AI Security Fundamentals',
    tags: ['model-drift', 'data-drift', 'concept-drift', 'definition'],
  },
  {
    id: 'sf061',
    type: 'term',
    content:
      'MLOps: The set of practices, tools, and cultural philosophies that combine machine learning development with operational deployment. MLOps encompasses the full ML lifecycle—data management, training pipelines, model validation, deployment, monitoring, and retraining—with the goal of making ML systems reliable, scalable, and maintainable in production environments.',
    domain: 'AI Security Fundamentals',
    tags: ['mlops', 'definition', 'lifecycle'],
  },
  {
    id: 'sf062',
    type: 'term',
    content:
      'Explainable AI (XAI): A field of AI that develops methods and techniques enabling humans to understand, interpret, and trust the predictions and decisions made by AI models. XAI techniques range from inherently interpretable models (decision trees, linear models) to post-hoc explanation methods (SHAP, LIME, attention visualization) applied to black-box models.',
    domain: 'Securing AI Systems',
    tags: ['xai', 'explainability', 'interpretability', 'definition'],
  },
  {
    id: 'sf063',
    type: 'term',
    content:
      'AI Red Teaming: An adversarial testing practice in which a dedicated team probes an AI system to identify vulnerabilities, failure modes, and potential misuses before deployment. AI red teaming covers safety (harmful outputs), security (adversarial attacks, extraction, jailbreaks), and reliability (edge case failures), combining human creativity with automated testing tools.',
    domain: 'Securing AI Systems',
    tags: ['red-teaming', 'definition', 'testing'],
  },
  {
    id: 'sf064',
    type: 'term',
    content:
      'Trusted Execution Environment (TEE): A hardware-isolated secure area within a processor that provides confidentiality and integrity guarantees for code and data, even from privileged software (OS, hypervisor). Examples include Intel SGX, AMD SEV, and ARM TrustZone. Used in ML to protect model weights during inference and enable remote attestation.',
    domain: 'Securing AI Systems',
    tags: ['tee', 'sgx', 'hardware-security', 'definition'],
  },
  {
    id: 'sf065',
    type: 'term',
    content:
      'Prompt Injection: An attack against LLM-based systems where maliciously crafted input text overrides or manipulates the model\'s intended behavior. Direct prompt injection targets the model via user-controlled input; indirect prompt injection embeds adversarial instructions in external content (web pages, documents) that the model retrieves and processes as part of its workflow.',
    domain: 'Adversarial Threats',
    tags: ['prompt-injection', 'llm', 'definition'],
  },

  // ── CONCEPTS (10) ─────────────────────────────────────────────────────────
  {
    id: 'sf066',
    type: 'concept',
    content:
      'The Privacy-Utility Trade-off in ML: Applying stronger privacy mechanisms (smaller DP epsilon, more noise) consistently reduces model accuracy and usefulness. This fundamental tension means practitioners must select privacy parameters based on the sensitivity of training data and the acceptable utility degradation — there is no universally correct ε value, only contextually appropriate trade-offs.',
    domain: 'Data Security & Model Integrity',
    tags: ['privacy-utility', 'trade-off', 'differential-privacy'],
  },
  {
    id: 'sf067',
    type: 'concept',
    content:
      'Defense in Depth for AI Systems: Effective AI security requires multiple overlapping layers rather than a single control. No individual defense (adversarial training, input preprocessing, output filtering) is sufficient against adaptive adversaries. A robust posture combines: secure training pipelines, model integrity verification, inference-time anomaly detection, output filtering, rate limiting, and continuous monitoring — with each layer compensating for weaknesses in others.',
    domain: 'Securing AI Systems',
    tags: ['defense-in-depth', 'layered-security', 'strategy'],
  },
  {
    id: 'sf068',
    type: 'concept',
    content:
      'The Threat Model Shapes the Defense: The appropriate security controls for an AI system depend entirely on the assumed adversary\'s capabilities and goals. A threat model that assumes only external black-box API access requires different defenses than one that includes supply chain attackers or malicious insiders with training data access. Skipping threat modeling leads to over-investing in low-priority defenses while leaving critical attack vectors unaddressed.',
    domain: 'AI Security Fundamentals',
    tags: ['threat-modeling', 'risk-assessment', 'adversary-model'],
  },
  {
    id: 'sf069',
    type: 'concept',
    content:
      'Adversarial Arms Race Dynamics: Security controls for AI systems exist in a perpetual arms race. Defenses improve to counter known attacks; attackers develop adaptive attacks that defeat the defenses. This is particularly acute for black-box defenses: a defense that works against non-adaptive attacks often fails when the adversary knows the defense and can optimize their attack around it. This motivates certified (provably robust) defenses that guarantee resistance regardless of adaptive adversary strategy.',
    domain: 'Adversarial Threats',
    tags: ['arms-race', 'adaptive-attacks', 'certified-defenses'],
  },
  {
    id: 'sf070',
    type: 'concept',
    content:
      'Shared Responsibility in AI Security: When AI systems are built on cloud infrastructure, pretrained models from third parties, and open-source frameworks, security responsibility is distributed across the supply chain. Cloud providers secure physical infrastructure; framework maintainers patch library vulnerabilities; model developers secure training pipelines; deployers secure inference infrastructure and monitor outputs. Gaps at any layer — including trust assumptions between layers — create exploitable vulnerabilities.',
    domain: 'Securing AI Systems',
    tags: ['shared-responsibility', 'supply-chain', 'cloud-security'],
  },
  {
    id: 'sf071',
    type: 'concept',
    content:
      'Memorization vs. Generalization Trade-off in Privacy: Models that perfectly memorize training data generalize poorly and are maximally vulnerable to membership inference and extraction attacks. Models that generalize well (learn population-level patterns rather than individual records) are naturally more privacy-preserving. Regularization, DP training, and data deduplication reduce memorization, simultaneously improving privacy and generalization.',
    domain: 'Data Security & Model Integrity',
    tags: ['memorization', 'generalization', 'privacy'],
  },
  {
    id: 'sf072',
    type: 'concept',
    content:
      'Risk-Based Regulation Principle in the EU AI Act: Rather than regulating all AI uniformly, the EU AI Act imposes requirements proportional to the potential for harm. Lower-risk systems face minimal or transparency-only requirements; higher-risk systems face full conformity assessment requirements. This approach attempts to balance innovation enablement with protection of fundamental rights, focusing regulatory burden where harm potential is greatest.',
    domain: 'AI Governance & Compliance',
    tags: ['risk-based', 'eu-ai-act', 'proportionality'],
  },
  {
    id: 'sf073',
    type: 'concept',
    content:
      'The Role of Human Oversight in Limiting AI Harm: Human oversight provisions in governance frameworks (EU AI Act, NIST AI RMF) are premised on the understanding that current AI systems are not reliable enough to be fully autonomous in high-stakes decisions. Human oversight provides a backstop against model errors, adversarial manipulations, and distributional failures — but is only effective if humans are given sufficient information, time, and competence to genuinely evaluate AI outputs rather than rubber-stamp them.',
    domain: 'AI Governance & Compliance',
    tags: ['human-oversight', 'automation-bias', 'governance'],
  },
  {
    id: 'sf074',
    type: 'concept',
    content:
      'The Dual-Use Nature of AI in Security: AI techniques are simultaneously used to attack and defend security systems. ML improves malware detection, but adversaries use adversarial ML to evade those detectors. LLMs assist analysts, but also generate phishing content at scale and assist in vulnerability discovery. Understanding this dual-use dynamic is essential for predicting where the next generation of attacks will emerge and where AI-based defenses will provide durable versus temporary advantages.',
    domain: 'AI in Security Operations',
    tags: ['dual-use', 'offense-defense', 'adversarial-ml'],
  },
  {
    id: 'sf075',
    type: 'concept',
    content:
      'Evidence Integrity in AI Incident Response: Unlike traditional software forensics where artifacts (binary files, log records) are relatively static, AI forensics must contend with the stochastic nature of model outputs, distributed training artifacts, and the difficulty of attributing specific behavior to specific training data. Pre-incident preparation — including cryptographically signed model artifacts, immutable audit logs, and behavioral baselines — is essential because reconstructing the forensic record post-incident from unsigned, mutable artifacts is often impossible.',
    domain: 'Incident Response for AI Systems',
    tags: ['forensics', 'evidence-integrity', 'incident-response'],
  },
];
