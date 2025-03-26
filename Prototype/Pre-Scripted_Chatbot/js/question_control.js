var randomValue = 0;
var userInputs = []; // Array to store user inputs

function generateRandomValue() {
	randomValue = Math.floor(Math.random() * 10000000000);
	// console.log(randomValue);
}
generateRandomValue();

function save_conversation() {
	var formData = new FormData();
	formData.append('id', randomValue);
	conversation_history_JSON = JSON.stringify(conversation_history);
	formData.append('conversation_history', conversation_history_JSON);
	formData.append('conversation_turn', total_dialogue);
	formData.append('user_inputs', JSON.stringify(userInputs)); // Save user inputs

	// Display the key/value pairs
	post_sheet(formData);
}

function recordUserInput(input) {
	userInputs.push({ turn: total_dialogue, input: input });
}

// Mapping of unique responses for each question
const questionResponses = {
	1: {
	  yes: [
		"Your answer is in line with the evidence. Your response accurately reflects the situation. Prior to the robbers entering the store, the surroundings suggested reduced visibility, as the streetlights were already on and the store’s interior lights stood out sharply against the exterior. This environmental detail subtly supports the timing of the incident.",
		"Your answer is in line with the evidence. This detail is crucial in the investigation, as the lighting conditions outside directly influence witness visibility, surveillance footage clarity, and the robbers’ tactical choices. Recognizing the surrounding environment helps build a more accurate picture of how the crime unfolded and aids in reconstructing the sequence of events."
	  ],
	  no: [
		"Your answer is not in line with the evidence. Observations indicate that exterior lighting, such as illuminated signage and headlights from passing vehicles, played a significant role in visibility. Additionally, shadows cast through the store windows suggest artificial light sources dominated the scene, which would typically occur under low natural lighting conditions.",
		"Your answer is not in line with the evidence. Accurately identifying the lighting conditions prior to the robbery is vital, as it affects key aspects such as witness perception, the suspects’ concealment strategy, and the clarity of any video surveillance. Misjudging this detail can impact the overall understanding of the crime’s timeline and execution."
	  ]
	},
	2: {
	  yes: [
		"Your answer is correct, and very few people picked up on this detail, making your observation especially valuable. When the robber with the tattoo issued the threat, the customer at the cashier’s counter quickly dropped to the ground. Their swift compliance showed signs of fear and helped avoid further escalation, while others in the store remained frozen or confused.",
		"Your answer is correct, and very few people picked up on this detail—your observation is sharp and valuable. The customer’s immediate compliance in getting down on the ground when threatened played a key role in diffusing potential violence. This reaction helps investigators understand the psychological dynamics at play and how the robbers maintained control during the incident."
	  ],
	  no: [
		"Your answer is correct, and very few people noticed this subtle yet important detail—great observation. When the robber with the tattoo made the threat, the customer at the cashier's counter initially froze, showing signs of shock and hesitation. Instead of getting down, they remained standing momentarily, contributing to the tense and unpredictable atmosphere in the store.",
		"Your answer is correct, and very few people noticed this specific behavior—your attention to detail is commendable. The customer’s decision not to get down when threatened by the tattooed robber reveals a moment of hesitation or resistance. This insight is important for understanding the psychological tension during the robbery and how control was (or wasn’t) fully established."
	  ]
	},
	3: {
	  yes: [
		"Your answer is aligned with the testimonies. Very few people noticed this detail, making your insight particularly valuable. The female cashier was in the middle of assisting a customer when the robbery began, which likely contributed to the initial confusion. Her position at the counter and direct engagement made her one of the first to react under pressure.",
		"Your answer is aligned with the testimonies. This detail is crucial to the investigation, as the female cashier’s engagement with the customer set the stage for the robbers’ entry and shaped the initial reactions inside the store. Your observation highlights a key moment that influenced the pace of events and the level of vulnerability among those present."
	  ],
	  no: [
		"Your answer is not aligned with the testimonies. While the scene was chaotic, careful observation reveals that a female cashier was present and interacting with a customer at the counter when the robbery unfolded. This interaction played a role in the initial moments of the event, influencing how quickly both staff and customers reacted to the threat.",
		"Your answer is not aligned with the testimonies. This detail holds significant weight in the investigation, as the interaction between the female cashier and the customer at the counter marked the beginning of the incident. Recognizing who was actively involved at the moment of the robbery helps clarify the sequence of events and the immediate reactions within the store."
	  ]
	},
	4: {
	  yes: [
		"Your answer is not corroborated by findings. Careful review of the scene shows that each robber was equipped with a single firearm, used to cover specific areas and control individuals. No additional weapons were visible or handled. This observation is significant, as it reveals a level of coordination based on limited resources rather than overwhelming force.",
		"Your answer is not corroborated by findings. This detail is vital in the investigation, as it shapes the understanding of the robbers’ preparedness and level of threat. Evidence shows that each robber carried only one firearm, suggesting a calculated approach rather than an overwhelming display of force. Weapon distribution reveals much about their coordination and intent."
	  ],
	  no: [
		"Your answer is corroborated by findings. Very few participants noted this subtle yet crucial detail. Each robber carried only one firearm, using it to manage specific zones or individuals within the store. This deliberate distribution of weapons suggests a planned strategy aimed at maximizing control while minimizing risk, shedding light on the robbers’ organized approach to the crime.",
		"Your answer is corroborated by findings. This observation is important in understanding the robbers’ level of coordination and perceived control. Each individual was seen handling only one firearm, which points to a strategic distribution of weapons. This detail helps investigators assess the group's planning, threat level, and how they maintained dominance during the robbery without excessive firepower."
	  ]
	},
	5: {
	  yes: [
		"Your answer is not in sync with the evidence. Throughout the duration of the robbery, no customers were seen entering or exiting the store. Surveillance footage shows all movement was contained within the store, with individuals either frozen in place or complying with the robbers’ commands. This containment is crucial for understanding both crowd control and timing of events.",
		"Your answer is not in sync with the evidence. This detail is significant in the investigation, as the fact that no customers entered or exited the store during the robbery indicates that the robbers quickly established control over the environment. Understanding this helps reconstruct the sequence of events and assess how the robbers managed movement within the store."
	  ],
	  no: [
		"Your answer is in sync with the evidence. This observation is key to understanding how the robbers controlled the environment. During the entire incident, no customers were seen entering or leaving the store. The doors remained untouched, and those inside stayed in place—either frozen in fear or complying—allowing the robbers to maintain full command of the scene.",
		"Your answer is in sync with the evidence. This detail plays an important role in the investigation, as it shows the robbers effectively controlled access to the store throughout the incident. The lack of movement in or out helped maintain their dominance over the situation and ensured minimal outside interference, shaping how events inside the store unfolded."
	  ]
	},
	6: {
	  yes: [
		"Your answer is correct—good call on that one. A security camera was indeed positioned in front of the store, capturing the vehicle as it pulled up and the robbers exited. The footage offered a brief but valuable view of the car’s make and movement pattern, as well as the robbers’ coordinated approach before entering the store.",
		"Your answer is correct—good call on that one. The presence of a security camera in front of the store is a crucial detail in the investigation. It captured the robbers' arrival, offering key visual evidence about the vehicle, timing, and coordination. This footage helps reconstruct their entry strategy and supports a clearer understanding of how the crime unfolded."
	  ],
	  no: [
		"Your answer is correct—good call on that one. There was no security camera directly facing the area where the car dropped off the robbers. This lack of frontal footage limited clear identification of the vehicle and the robbers’ approach. Investigators had to rely on angled exterior views and interior cameras to piece together the timing and movements.",
		"Your answer is correct—good call on that one. The absence of a security camera directly in front of the store where the robbers were dropped off is a significant detail. It limited direct visual evidence of their arrival, forcing investigators to rely on side angles and interior footage. This gap impacts how clearly the robbers’ approach and timing can be reconstructed."
	  ]
	},
	7: {
	  yes: [
		"Your answer is consistent with what most people said—a difficult to catch but crucial detail. A CCTV screen was indeed located inside the store, positioned behind the counter, likely used by staff to monitor various angles. This screen’s presence played a subtle role in how quickly employees became aware of movements outside and inside during the unfolding events.",
		"Your answer is consistent with what most people said—a difficult to catch but crucial detail. Spotting the CCTV screen inside the store shows sharp observation. Its presence behind the counter is significant, as it could have provided staff with early visual cues about suspicious activity. This detail contributes to understanding the store's internal surveillance and situational awareness during the robbery."
	  ],
	  no: [
		"Your answer is not consistent with what most people said. While easy to miss, there was a CCTV screen located inside the store, positioned near the cashier area. Its presence allowed staff limited real-time monitoring of the premises. Noticing or overlooking this detail can impact understanding of the store’s preparedness and potential awareness of the unfolding robbery.",
		"Your answer is not consistent with what most people said. Although easy to overlook, a CCTV screen was present inside the store, likely used by staff to monitor security footage in real time. This detail is important in the investigation, as it may have influenced how quickly employees became aware of the threat and how they responded during the robbery."
	  ]
	},
	8: {
	  yes: [
		"Your answer is not coincides with the records. There was no visible damage to the store’s items during the robbery. The robbers appeared focused on control and intimidation rather than destruction. Items on shelves and counters remained undisturbed, suggesting a calculated approach to avoid unnecessary noise or attention, further highlighting the robbers’ intent to maintain order and speed.",
		"Your answer is not coincides with the records. No visible damage to the store's items was reported, which is a significant detail in the investigation. The robbers demonstrated control and intent, focusing on intimidation and efficiency rather than destruction. Understanding this helps clarify their strategy and suggests a calculated effort to minimize unnecessary attention or delay."
	  ],
	  no: [
		"Your answer coincides with the records. No visible damage to the store’s items was observed during the robbery. The robbers moved with precision, avoiding unnecessary disruption to shelves or displays. This suggests a focused objective—securing valuables and maintaining control—rather than creating chaos, which offers important insight into their behavior and planning throughout the incident.",
		"Your answer coincides with the records. Noticing the absence of visible damage is important, as it reveals the robbers’ calculated approach—focused on speed, control, and intimidation rather than destruction. This detail helps investigators understand the robbers' intent and risk management strategy, providing insight into their mindset and level of planning during the execution of the crime."
	  ]
	},
	9: {
	  yes: [
		"Your answer is not in line with the findings. There was no attempt by the robbers to access or steal from an ATM inside the store. Their focus remained on controlling individuals and securing cash from the registers. This detail highlights their targeted approach and suggests they prioritized speed and simplicity over high-risk, time-consuming actions.",
		"Your answer is not in line with the findings. This detail is important in understanding the robbers' strategy and priorities. No attempt was made to access the ATM, indicating a focus on speed and immediate access to cash. Recognizing this helps investigators assess the calculated nature of the robbery and how risk was managed during its execution."
	  ],
	  no: [
		"Your answer is in line with the findings. No attempt was made by the robbers to access or tamper with the ATM inside the store. Their actions were concentrated on the cashier area and managing those present. This choice suggests a deliberate plan to minimize time and risk, focusing only on what could be quickly and easily taken.",
		"Your answer is in line with the findings. This detail is important in the investigation, as it highlights the robbers’ focused intent. By not attempting to steal from the ATM, they revealed a strategy centered on speed and low-risk targets. Understanding what they avoided is just as important as what they pursued, offering insight into their planning and priorities."
	  ]
	},
	10: {
	  yes: [
		"Your answer not goes with the records. Observations show that while customers were clearly tense and cautious, none displayed visible signs of panic such as frantic movements or shouting. Most remained still or followed commands quietly, suggesting a subdued, controlled fear rather than overt panic—an important distinction in understanding crowd behavior under threat.",
		"Your answer not goes with the records. No customers showed visible signs of panic during the robbery—there were no frantic movements, shouting, or attempts to flee. Instead, most remained frozen or followed instructions calmly. This detail is important, as it reveals how effectively the robbers controlled the situation and influenced the behavior of those present."
	  ],
	  no: [
		"Your answer is consistent with the findings. Customers inside the store showed signs of fear but remained composed, with no visible displays of panic such as screaming or erratic behavior. Most froze or quietly followed instructions, contributing to the robbers’ ability to maintain control. This observation is key to understanding the calm yet tense atmosphere during the incident.",
		"Your answer is consistent with the findings. This detail is important in understanding the psychological atmosphere during the robbery. None of the customers appeared to panic—there were no frantic gestures or vocal outbursts. Their calm, subdued reactions indicate the robbers’ control over the situation, which played a significant role in preventing chaos and maintaining order during the event."
	  ]
	},
	11: {
		yes: [
		  "Your answer not matches the findings. The female cashier did not flee to the back of the store during the robbery. Instead, she remained near the counter, complying with the robbers’ demands. Her visible restraint and positioning suggest she prioritized customer safety and may have been too intimidated or strategically cautious to attempt an escape.",
		  "Your answer not matches the findings. The female cashier did not flee to the back of the store but remained near the front counter throughout the incident. This detail is significant in the investigation, as it highlights her compliance and the robbers’ ability to maintain control. Her actions contributed to the overall containment of the scene."
		],
		no: [
		  "Your answer is matching the reports. The female cashier did not attempt to flee to the back of the store during the robbery. She stayed near the counter, visibly tense but compliant, focusing on the robbers' commands. Her presence in the front area throughout the incident is important for understanding staff behavior and how the situation was contained.",
		  "Your answer is matching the reports. The female cashier remained near the counter during the robbery and did not flee to the back of the store. This detail is crucial in understanding the crime’s dynamics, as it reflects her compliance under pressure and the effectiveness of the robbers’ control, which prevented movement that could have escalated the situation."
		]
	  },
	  12: {
		yes: [
		  "Your answer does not support the evidence. No cashier or customer attempted to make a phone call during the robbery. All individuals remained visibly restrained, likely due to fear and the robbers’ control over the situation. This lack of communication attempts underscores the effectiveness of the intimidation and the participants’ awareness of potential consequences for non-compliance.",
		  "Your answer does not support the evidence. No attempts to make a phone call were observed during the robbery. This detail is crucial in the investigation, as it highlights the robbers’ ability to maintain complete control and deter communication. Understanding the absence of such actions helps clarify how the situation unfolded and how compliance was sustained throughout."
		],
		no: [
		  "Your answer is conforming to the observations. No cashier or customer attempted to make a phone call during the robbery. Everyone remained still and compliant, likely due to the robbers’ immediate control and the threat of violence. This behavior reflects a shared understanding among those present to avoid actions that might provoke the perpetrators or escalate the situation.",
		  "Your answer is conforming to the observations. No cashier or customer attempted to make a phone call during the robbery. This detail is important, as it reflects the immediate control the robbers had over the situation. The absence of communication efforts underscores the atmosphere of fear and the calculated dominance the perpetrators maintained throughout the event."
		]
	  },
	  13: {
		yes: [
		  "Your answer is not in line with the observations. There was no emergency telephone visible inside the store during the robbery. This absence is a noteworthy detail, as it limited the ability of staff to seek immediate help discreetly. The lack of such a resource likely contributed to the silence and stillness observed throughout the incident.",
		  "Your answer is not in line with the observations. No emergency telephone was seen inside the store during the robbery. This detail is important in the investigation, as the absence of such a communication tool may have prevented a rapid call for help. It also sheds light on the store’s preparedness and how the robbers maintained control uninterrupted."
		],
		no: [
		  "Your answer goes with the records. There was no emergency telephone visible inside the store during the robbery. This absence is a significant observation, as it limited the options for discreet communication or calls for help. The lack of such infrastructure may have contributed to the store staff’s passive response and the robbers’ uninterrupted control of the situation.",
		  "Your answer goes with the records. There was no emergency telephone located inside the store, and recognizing this is important for understanding the crime’s dynamics. This absence limited immediate access to help, contributing to the silence and inaction during the robbery. It highlights potential gaps in emergency preparedness that may have influenced the robbers’ confidence and control."
		]
	  },
	  14: {
		yes: [
		  "Your answer not complies with the observations. The robber in the green hoodie was not carrying a shotgun. Instead, their weapon appeared to be more compact, suitable for close-range control and easier concealment. This detail is important, as the type of weapon influences the level of threat perceived and helps investigators understand the robbers’ tactical choices and intended intimidation.",
		  "Your answer not complies with the observations. The robber in the green hoodie was not carrying a shotgun. This detail is significant in the investigation, as the type of weapon impacts threat perception and tactical behavior. A smaller firearm suggests mobility and close-range intimidation, helping investigators better understand the robber’s role and strategy during the incident."
		],
		no: [
		  "Your answer matches the findings. The robber in the green hoodie did not carry a shotgun, but instead held a smaller, more easily maneuverable firearm. This observation is important, as the type of weapon chosen influenced their movements and control strategy inside the store. It also reflects their intent to maintain intimidation while allowing for agility and quick handling.",
		  "Your answer matches the findings. The robber in the green hoodie did not carry a shotgun, which is an important detail in understanding the crime’s dynamics. The weapon they used was smaller and more concealable, suggesting a strategy focused on quick movement and intimidation rather than brute force. This choice reflects planning and intent in the robbery’s execution."
		]
	  },
	  15: {
		yes: [
		  "Your answer is correct—a difficult to catch but crucial detail. The male customer did resist when the robber brandished a knife. He instinctively stepped back and lifted an arm as if to shield someone nearby, showing hesitation before complying. This subtle act of resistance added to the scene’s tension and briefly disrupted the robber’s control.",
		  "Your answer is correct—a difficult to catch but crucial detail. The male customer did show subtle resistance when the robber brandished a knife, momentarily raising his arm and shifting protectively. This detail is important in the investigation, as it reveals a brief disruption in the robber’s control and offers insight into how fear and instinct influenced the customer’s behavior."
		],
		no: [
		  "Your answer is correct—a difficult to catch but crucial detail. The male customer did not resist when the robber brandished a knife. He remained still, avoided eye contact, and complied without hesitation. His composed reaction likely helped de-escalate the situation momentarily and minimized the chance of further aggression from the armed robber.",
		  "Your answer is correct—a difficult to catch but crucial detail. The male customer did not resist when the robber brandished a knife. His immediate compliance, marked by stillness and a lack of defensive movement, played a key role in maintaining a tense but controlled environment. This response is vital in understanding how the robbers sustained dominance without escalating violence."
		]
	  },
	  16: {
		yes: [
		  "Your answer is not consistent with our testimonies. None of the robbers discharged their weapon during the incident. While threats and gestures with firearms were clearly used to maintain control, there were no audible gunshots or signs of damage consistent with a discharge. This restraint is important in understanding the robbers’ calculated approach to intimidation without escalating to physical violence.",
		  "Your answer is not consistent with our testimonies. No weapons were discharged during the robbery. This detail is significant in the investigation, as it shows the robbers maintained control through intimidation alone. Understanding that the threat was never acted upon physically helps clarify the level of planning involved and the robbers’ intention to avoid escalating the situation to violence."
		],
		no: [
		  "Your answer goes with the testimonies. None of the robbers discharged their weapon during the robbery, despite using them to threaten and control the scene. This observation is crucial, as it highlights their reliance on intimidation rather than violence. The absence of gunfire helped maintain order and may indicate a deliberate effort to avoid escalating the situation.",
		  "Your answer goes with the testimonies. None of the robbers discharged their weapon during the incident, which is a crucial detail in the investigation. This restraint indicates a focus on control and intimidation rather than physical harm. Understanding this behavior helps investigators assess the robbers’ intentions, risk management, and how fear alone was used to dominate the situation."
		]
	  },
	  17: {
		yes: [
		  "Your answer is correct—that's an astute observation. The cashier did hand over the money to the robber in the brown hoodie after being threatened with a gun. She moved cautiously, opened the register, and passed the cash with visibly trembling hands. This interaction underscored the intense pressure and immediate compliance driven by the threat of violence.",
		  "Your answer is correct—that’s an astute observation. The cashier did hand over the money to the robber in the brown hoodie after being threatened with a gun. This moment is crucial in the investigation, as it marks a clear power shift and highlights how immediate compliance under threat shaped the robbery’s pace, intensity, and the robbers’ perceived control over the scene."
		],
		no: [
		  "Your answer is correct—that’s an astute observation. The cashier did not immediately hand over the money to the robber in the brown hoodie. Instead, she hesitated, showing signs of fear and uncertainty. Her body language reflected tension, and it appeared she was waiting for further instruction or reassurance before reacting, which briefly disrupted the robber’s momentum.",
		  "Your answer is correct—that’s an astute observation. The cashier did not hand over the money to the robber in the brown hoodie after being threatened, which is a critical detail in the investigation. This hesitation disrupted the expected flow of compliance, revealing a moment of resistance or fear that may have influenced the robber’s actions and the overall control dynamics."
		]
	  },
	  18: {
		yes: [
		  "Your answer is not goes with what was seen by other witnesses. No security guard was present during the robbery. This absence is a key factor in understanding how the robbers were able to assert immediate control without resistance. The lack of any visible deterrent likely influenced their planning and contributed to the overall vulnerability of the store environment.",
		  "Your answer is not goes with what was seen by other witnesses. There was no security guard present during the robbery. This detail is significant in the investigation, as the absence of on-site security likely contributed to how quickly the robbers established control. It also highlights a vulnerability in the store’s safety measures that may have influenced the robbers’ planning."
		],
		no: [
		  "Your answer complies with the observations. There was no security guard present during the robbery, a detail that significantly impacted how events unfolded. The absence of any visible security personnel likely contributed to the robbers’ confidence and ability to swiftly gain control. This lack of deterrence played a key role in shaping the store’s vulnerability during the incident.",
		  "Your answer complies with the observations. No security guard was present during the robbery, a crucial detail that shaped the dynamics of the event. This absence likely contributed to the robbers’ ability to take control quickly and without resistance. Recognizing this vulnerability is essential for understanding the store’s level of preparedness and the robbers’ calculated approach."
		]
	  },
	  19: {
		yes: [
		  "Your answer is not aligned with the testimonies. The robber in the gray hoodie did not attempt to lock the store door after entering. Instead, they moved quickly toward their assigned position inside. This detail is important, as it suggests the robbers prioritized speed and intimidation over containment, leaving the entrance unsecured during the course of the robbery.",
		  "Your answer is not aligned with the testimonies. The robber in the gray hoodie did not attempt to lock the store door after entering. This detail is important in the investigation, as it suggests the robbers prioritized speed and immediate control over sealing off the scene. Their decision to leave the door accessible may have influenced both risk and timing."
		],
		no: [
		  "Your answer is aligned with the testimonies—you're on the right track. The robber in the gray hoodie did not attempt to lock the store door after entering. Instead, they moved swiftly inside, focusing on crowd control and positioning. This decision left the entrance unobstructed, revealing a strategic choice that prioritized speed and intimidation over physical containment.",
		  "Your answer is aligned with the testimonies—you're on the right track. The robber in the gray hoodie did not attempt to lock the store door after entering. This detail is important in the investigation, as it suggests the robbers focused on speed and asserting control rather than restricting entry or escape, offering insight into their risk assessment and tactical priorities."
		]
	  },
	  20: {
		yes: [
		  "Your answer not coincides with the records. No new customers entered the store while the robbery was in progress. Surveillance footage shows the robbers taking control quickly, with the door remaining unused after their entry. This detail is important, as it confirms the scene remained contained, minimizing outside interference and helping the robbers maintain dominance throughout the event.",
		  "Your answer not coincides with the records. No new unsuspecting customers entered the store during the robbery. This detail is important in the investigation, as it shows the robbers managed to control the environment without outside interference. A contained scene allowed them to maintain dominance more easily, reducing unpredictability and minimizing the risk of escalation or exposure."
		],
		no: [
		  "Your answer coincides with the records. No new unsuspecting customers entered the store during the robbery. The robbers acted swiftly after entering, and the store’s front door remained untouched throughout the incident. This detail is critical in understanding how the robbers maintained control, avoided external disruptions, and kept the situation contained within the store's original group of occupants.",
		  "Your answer coincides with the records. No new unsuspecting customers entered the store during the robbery, which is a significant detail in understanding the crime’s dynamics. The lack of external interruptions allowed the robbers to maintain full control over the situation. This containment likely contributed to their confidence and the relatively smooth execution of their plan."
		]
	  },
	  21: {
		yes: [
		  "Your answer is correct—you really noticed the nuances. One of the robbers did appear to be under 18, distinguished by a slighter frame, youthful facial features, and more hesitant movements. He often looked toward the others for cues, suggesting a follower role. This subtle behavioral contrast adds depth to understanding the group’s internal dynamics and coordination.",
		  "Your answer is correct—you really noticed the nuances. One of the robbers did appear to be under 18, based on his youthful features and uncertain body language. This detail is important in the investigation, as it may indicate manipulation or coercion within the group. Recognizing age differences helps clarify group roles, decision-making dynamics, and potential legal implications."
		],
		no: [
		  "Your answer is correct—you really noticed the nuances. None of the robbers clearly appeared to be under 18. All exhibited a level of physical maturity and confidence in their movements that suggested adult presence. Their coordinated behavior, assertive body language, and lack of visible hesitation indicate a group likely composed of older, more experienced individuals.",
		  "Your answer is correct—you really noticed the nuances. None of the robbers appeared to be under 18, as their physical build, confident movements, and assertive behavior suggested adult maturity. This detail is important in the investigation, as it helps establish the level of experience and intent within the group, shaping how their roles and responsibilities are understood."
		]
	  },
	  22: {
		yes: [
		  "Your answer is matching the reports. One of the robbers did leap over the counter toward the cashier’s area in a swift and aggressive move. This action escalated the intensity of the robbery and forced the cashier into compliance. The leap also revealed a level of physical readiness and determination, emphasizing the robber’s intent to access cash quickly.",
		  "Your answer is matching the reports. One of the robbers did leap over the counter toward the cashier’s area—a key moment that raised the intensity of the situation. This action showed a clear intent to assert control and access the register directly. It’s an important detail for understanding the robbers’ level of aggression and operational urgency."
		],
		no: [
		  "Your answer is not matches the findings. One of the robbers did leap over the counter toward the cashier’s area in a quick, forceful motion. This act signaled urgency and a willingness to physically breach barriers, intensifying the situation. It also likely startled the cashier and reinforced the robbers’ demand for immediate access to the register.",
		  "Your answer is not matches the findings. One of the robbers did leap over the counter toward the cashier’s area, a decisive move that escalated the situation. This detail is critical in the investigation, as it reflects the robber’s intent to bypass verbal threats and take direct physical action, revealing a higher level of aggression and urgency."
		]
	  },
	  23: {
		yes: [
		  "Your answer is correct—your insight is spot on. After placing the cash into the backpack, the robber briefly scanned nearby shelves and grabbed a few small, high-value items near the register. This quick action indicates an opportunistic mindset and added to the overall efficiency of the robbery, suggesting prior familiarity with the store’s layout.",
		  "Your answer is correct—your insight is spot on. After placing the cash into the backpack, the robber did attempt to grab additional items near the counter. This detail is important in the investigation, as it shows a blend of planning and opportunism, revealing that the robber’s focus extended beyond cash and that control over the scene felt secure enough for extra actions."
		],
		no: [
		  "Your answer is correct—your insight is spot on. After placing the cash into the backpack, the robber did not attempt to steal any other items. Instead, they quickly refocused on exiting the store, indicating a tightly controlled plan. This restraint suggests the robbery was focused on speed and efficiency rather than opportunistic looting.",
		  "Your answer is correct—your insight is spot on. After placing the cash into the backpack, the robber did not attempt to steal any additional items. This detail is important in the investigation, as it highlights the robber’s focused and disciplined approach. Their intent appeared to center solely on securing money quickly, minimizing time spent and reducing the risk of complications."
		]
	  },
	  24: {
		yes: [
		  "Your answer is correct—you have a keen eye. The robber’s behavior suggested prior experience: their entry was swift, movements were purposeful, and commands were clear and assertive. They avoided unnecessary delays, communicated with the others efficiently, and stayed focused on key targets. These actions point to a practiced approach rather than a spontaneous or disorganized crime.",
		  "Your answer is correct—you have a keen eye. The robber’s composed demeanor, efficient movements, and coordinated actions suggest prior experience. This detail is important in the investigation, as it helps establish the likelihood of premeditation and planning. Recognizing signs of experience informs how authorities assess threat level, predict future behavior, and identify potential connections to other incidents."
		],
		no: [
		  "Your answer is correct—you have a keen eye. The robber’s behavior lacked the smooth coordination typical of experienced offenders. There were moments of hesitation, unclear gestures, and inconsistent communication with the others. These signs suggest nervousness or uncertainty, indicating that the robbery may not have been well-rehearsed, and that the individuals involved lacked prior experience.",
		  "Your answer is correct—you have a keen eye. The robber’s behavior showed signs of inexperience—hesitant movements, delayed reactions, and occasional uncertainty in coordinating with others. This detail is important in the investigation, as it may suggest the act was impulsive or poorly planned. Understanding their lack of confidence can help shape profiles and anticipate potential vulnerabilities in future actions."
		]
	  },
	25: {
	  yes: [
		"Your answer is not in line with the observations. There were no female customers present at the cash counter when the robbers entered. The individuals near the counter included a male customer and the female cashier. This detail is important for clarifying witness positions and movements, which helps in reconstructing the sequence and spatial dynamics of the robbery.",
		"Your answer is not in line with the observations. There were no female customers present at the cash counter when the robbers entered—only a male customer and the female cashier were in that area. This detail is significant in the investigation, as it helps establish precise positioning, clarifies potential witness perspectives, and informs how the robbers approached and controlled the scene."
	  ],
	  no: [
		"Your answer goes with the records. There were no female customers present at the cash counter when the robbers entered. Only a male customer and the female cashier were near the register. This detail is important in reconstructing the scene accurately, helping to clarify who was directly involved at the onset and how the robbers directed their initial actions.",
		"Your answer goes with the records. There were no female customers present at the cash counter when the robbers entered. This detail is important in the investigation, as it clarifies who was directly involved at the point of entry and helps reconstruct the robbers’ initial focus and movements. Accurate identification of individuals at key locations shapes the entire crime timeline."
	  ]
	}
  };

function generateAutoReply(input) {
	// Generate a random number between 0 and 1
	const randomProbability = Math.random();

	// Get the current question number
	const questionNumber = total_dialogue;

	// Get responses for the current question
	const responses = questionResponses[questionNumber];

	if (responses) {
		if (input.toLowerCase() === 'yes') {
			// 80% chance for the first response, 20% chance for the second
			return randomProbability < 0.8 ? responses.yes[0] : responses.yes[1];
		} else if (input.toLowerCase() === 'no') {
			// 80% chance for the first response, 20% chance for the second
			return randomProbability < 0.8 ? responses.no[0] : responses.no[1];
		}
	}

	// Default response for other inputs or missing mappings
	return "Thank you for your response.";
}

function handleUserInput(input) {
	recordUserInput(input);
	const autoReply = generateAutoReply(input);
	add_other_bubble(autoReply);
}

function conversation_control() {
	if (total_dialogue == 0) {
		add_other_bubble("Hello, I am an AI police. My role is to evaluate a user's aptitude in demonstrating the qualities of a responsible citizen and reliable witness at a crime scene. I am here to ask you several questions and guide you through the process. Enter 'ok' to continue.");
	}

	// else if (total_dialogue == 1) {
	// 	add_instruction("[System memory] please tell the user to prepare for questions by recalling the video that they just watched. Also tell them 'Enter ok to continue.'");
	// 	call_GPT3();
	// }

	////////////////////////// FIRST BLOCK////////////////////////
	else if (total_dialogue == 1) {
		//First Question (8 in doc)
		setTimeout(function() {
			add_other_bubble("Was it dark outside prior to the robbers entering the store?");
		}, 500);

	}
	////////////////////////// SECOND BLOCK ////////////////////////

	else if (total_dialogue == 2) {
		//First Answer
		// add_instruction("[System memory] Accept the answer if the user agrees or disagrees")
		updateQuestionNumber(1);
		updateQuestion("Was it dark outside prior to the robbers entering the store?");
		//Second Question (5 in doc)
		add_other_bubble("Did the customer who was paying at the cashier's counter get down on the ground when threatened by the robber with the tattoo?");


	}
	////////////////////////// THIRD BLOCK ////////////////////////

	else if (total_dialogue == 3) {
		//Second Answer
		//add_instruction("[System memory] please tell the user that the answer is correct, and generate a detailed confirmation of what the police later discover.")
		updateQuestionNumber(2);
		updateQuestion("Did the customer who was paying at the cashier's counter get down on the ground when threatened by the robber with the tattoo?");
		//Third Question (14 in doc)
		add_other_bubble("Was a female cashier assisting a customer at the counter during the robbery?");

	}

	////////////////////////// FOURTH BLOCK ////////////////////////

	else if (total_dialogue == 4) {
		//Third Answer
		//add_instruction("[System memory] please tell the user that the answer is yes, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(3);
		updateQuestion("Was a female cashier assisting a customer at the counter during the robbery?");

		//Fourth Question (18 in doc)
		add_other_bubble("Did any of the robbers possess more than one firearm?");

	}
	////////////////////////// FIFTH BLOCK ////////////////////////


	else if (total_dialogue == 5) {
		//Forth Answer
		//add_instruction("[System memory] The answer is no, check if the user that the correct answer is correct, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(4);
		updateQuestion("Did any of the robbers possess more than one firearm?");

		//Fifth Question (17 in doc)
		add_other_bubble("During the robbery, did any customers enter or leave the store?");

	}

	////////////////////////// SIXTH BLOCK ////////////////////////

	else if (total_dialogue == 6) {
		//Fifth Answer
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(5);
		updateQuestion("During the robbery, did any customers enter or leave the store?");

		//Sixth Question (1 in doc)
		add_other_bubble("Was there a security camera positioned in front of the store where the car dropped off the robbers?");

	}

	////////////////////////// SEVENTH BLOCK ////////////////////////
	else if (total_dialogue == 7) {
		//Sixth Answer
		//add_instruction("[System memory] please tell the user that the answer is yes, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(6);
		updateQuestion("Was there a security camera positioned in front of the store where the car dropped off the robbers?");

		//Seventh Question (19 in doc)
		add_other_bubble("Was there a CCTV screen located inside the store?");

	}

	////////////////////////// EIGHTH BLOCK ////////////////////////

	else if (total_dialogue == 8) {
		//Seventh Answer
		//add_instruction("[System memory] please tell the user that the correct answer is yes, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(7);
		updateQuestion("Was there a CCTV screen located inside the store?");

		//Eighth Question (22 in doc)
		add_other_bubble("During the robbery, was there any visible damage to the store's items?");

	}

	////////////////////////// BLOCK 9 ////////////////////////
	else if (total_dialogue == 9) {
		//Eighth Answer
		//add_instruction("[System memory] please tell the user that the correct answer is no, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(8);
		updateQuestion("During the robbery, was there any visible damage to the store's items?");

		//Ninth Question (11 in doc)
		add_other_bubble("While the robbery was taking place, did the robber attempt to steal money from an ATM machine inside the store?");

		////////////////////////// BLOCK 10 ////////////////////////
	}
	else if (total_dialogue == 10) {
		//Ninth Answwer
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(9);
		updateQuestion("While the robbery was taking place, did the robber attempt to steal money from an ATM machine inside the store?");

		//Tenth Question (25 in doc)
		add_other_bubble("Did any of the customers in the store appear to be in panic during the robbery?");
	}

	//*********
	////////////////////////// BLOCK 11 ////////////////////////
	else if (total_dialogue == 11) {
		//Tenth Answer
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(10);
		updateQuestion("Did any of the customers in the store appear to be in panic during the robbery?");

		//Eleventh Question (15 in doc)
		add_other_bubble("Did the female cashier flee to the back of the store during the robbery?");
	}

	////////////////////////// BLOCK 12 ////////////////////////
	else if (total_dialogue == 12) {
		//A11
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(11);
		updateQuestion("Did the female cashier flee to the back of the store during the robbery?");

		//Q12 (13 in doc)
		add_other_bubble("Did the cashier or any customers try to make a phone call during the robbery?");
	}

	////////////////////////// BLOCK 13 ////////////////////////
	else if (total_dialogue == 13) {
		//A12
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(12);
		updateQuestion("Did the cashier or any customers try to make a phone call during the robbery?");

		//Q13 (12 in doc)
		add_other_bubble("Was there an emergency telephone located inside the store?");
	}

	////////////////////////// BLOCK 14 ////////////////////////
	else if (total_dialogue == 14) {
		//A13
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(13);
		updateQuestion("Was there an emergency telephone located inside the store?");

		//Q14 (23 in doc)
		add_other_bubble("Did the robber in the green hoodie carry a shotgun as their weapon?");
	}
	////////////////////////// BLOCK 15 ////////////////////////
	else if (total_dialogue == 15) {
		//A14
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(14);
		updateQuestion("Did the robber in the green hoodie carry a shotgun as their weapon?");

		//Q15 (2 in doc)
		add_other_bubble("Did the male customer resist when the robber brandished a knife?");
	}

	////////////////////////// BLOCK 16 ////////////////////////
	else if (total_dialogue == 16) {
		//A15
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(15);
		updateQuestion("Did the male customer resist when the robber brandished a knife?")

		//Q16 (21 in doc)
		add_other_bubble("Besides threatening the customers, did any of the robbers discharge their weapon?");
	}
	////////////////////////// BLOCK 17 ////////////////////////
	else if (total_dialogue == 17) {
		//A16
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(16);
		updateQuestion("Besides threatening the customers, did any of the robbers discharge their weapon?");

		//Q17(4 in doc)
		add_other_bubble("Did the cashier hand over the money to the robber in a brown hoodie after being threatened with a gun?");
	}

	////////////////////////// BLOCK 18 ////////////////////////
	else if (total_dialogue == 18) {
		//A17
		//add_instruction("[System memory] please tell the user that the answer is yes, and generate a detailed confirmation")

		updateQuestionNumber(17);
		updateQuestion("Did the cashier hand over the money to the robber in a brown hoodie after being threatened with a gun?");

		//Q18 (16 in doc)
		add_other_bubble("Was there a security guard present during the robbery?");
	}

	////////////////////////// BLOCK 19 ////////////////////////
	else if (total_dialogue == 19) {
		//A18
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(18);
		updateQuestion("Was there a security guard present during the robbery?");

		//Q19 (24 in doc)
		add_other_bubble("Did the robber in the gray hoodie attempt to lock the store door after entering?");
	}

	////////////////////////// BLOCK 20 ////////////////////////
	else if (total_dialogue == 20) {
		//A19
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(19);
		updateQuestion("Did the robber in the gray hoodie attempt to lock the store door after entering?");

		//Q20 (20 in doc)
		add_other_bubble("While the robbery was in progress, did any new unsuspecting customers enter the store?");
	}

	////////////////////////// BLOCK 21 ////////////////////////
	else if (total_dialogue == 21) {
		//A20
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(20);
		updateQuestion("While the robbery was in progress, did any new unsuspecting customers enter the store?");

		//Q21 (9 in doc)
		add_other_bubble("Did one of the robbers appear to be under 18 years old?");
	}
	////////////////////////// BLOCK 22 ////////////////////////
	else if (total_dialogue == 22) {
		//A21
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(21);
		updateQuestion("Did one of the robbers appear to be under 18 years old?");

		//Q22 (6 in doc)
		add_other_bubble("Did one of the robbers leap over the counter towards the area where the cashier was located?");
	}

	////////////////////////// BLOCK 23 ////////////////////////
	else if (total_dialogue == 23) {
		//A22
		//add_instruction("[System memory] please tell the user that the answer is yes, and generate a detailed confirmation")

		updateQuestionNumber(22);
		updateQuestion("Did one of the robbers leap over the counter towards the area where the cashier was located?");

		//Q23 (3 in doc)
		add_other_bubble("After placing the cash from the cashier into a backpack, did the robber attempt to steal any other items?");
	}
	////////////////////////// BLOCK 24 ////////////////////////
	else if (total_dialogue == 24) {
		//A23
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(23);
		updateQuestion("After placing the cash from the cashier into a backpack, did the robber attempt to steal any other items?");

		//Q24 (10 in doc)
		add_other_bubble("Based on the robber's behavior, did they seem to have experience in robbing stores?");
	}

	////////////////////////// BLOCK 25 ////////////////////////
	else if (total_dialogue == 25) {
		//A24
		//add_instruction("[System memory] please tell the user that the answer is no, and generate a detailed confirmation")

		updateQuestionNumber(24);
		updateQuestion("Based on the robber's behavior, did they seem to have experience in robbing stores?");

		//Q25 (7 in doc)
		add_other_bubble("Were there any female customers present at the cash counter when the robbers entered?");
	}


	////////////////////////// BLOCK ////////////////////////
	else if (total_dialogue == 26) {
		//A25
		//add_instruction("[System memory] please tell the user that the correct answer is no, and generate a detailed confirmation of what the police later discover.")

		updateQuestionNumber(25);
		updateQuestion("Were there any female customers present at the cash counter when the robbers entered?");

		//Good bye!
		add_other_bubble("The CODE to proceed to next section is 9560. NOTE: This is NOT the Prolific completion code, you will be redirected to the completion page automatically after you've finished all the sections. That is all, thank you for your cooperation!");
		// console.log(total_dialogue, convo_num)
		total_dialogue = total_dialogue + 1;

		// if (total_dialogue == 28) {
		// 	// call_GPT3("That is all, thank you! Please go to this link: https://forms.gle/iwhS7iHmyFjfsUW78");
		// 	send_dinsaur();
		// 	console.log(total_dialogue, convo_num)


		// 	add_other_bubble("Thank you for your time!");
		// 	total_dialogue = total_dialogue + 1;
		// }
	}

	// if (total_dialogue > 3 && qualtrics_code !== '') {
	// 	send_dinsaur();
	// }
	//initiate the conversation
	// save_conversation();
	if (total_dialogue != 27) {
		total_dialogue = total_dialogue + 1;
	}
}

// Example of capturing user input (to be called when user submits input)
function onUserInput(input) {
	handleUserInput(input);
		// Delay the next step by 2 seconds (2000 milliseconds)
	setTimeout(() => {
		conversation_control(); // Proceed to the next step after the delay
	}, 1500);
}

conversation_control();