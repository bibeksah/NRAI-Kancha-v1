export interface ManifestoItem {
  id: string
  title: string
  description: string
  problem: {
    short: string
    long: string
  }
  solution: {
    short: string[]
    long: {
      phases: {
        phase: string
        title: string
        items: string[]
      }[]
    }
  }
  realWorldEvidence: {
    short: string[]
    long: {
      country: string
      details: string
      impact: string
    }[]
  }
  implementation: {
    short: string[]
    long: {
      timeline: string
      description: string
      details: string[]
    }[]
  }
  performanceTargets: string[]
  category: string
  priority: "High" | "Medium" | "Low"
  timeline: string
  legalFoundation?: string
}

export const manifestoData: ManifestoItem[] = [
  {
    id: "1",
    title: "Make CIAA a Truly Independent Anti-Corruption Force",
    description:
      "Transform Nepal's anti-corruption commission into a powerful, independent body that can actually investigate and prosecute corruption cases without political interference.",
    problem: {
      short: "The CIAA has legal powers but can't use them effectively. Political leaders control who gets appointed, the government controls its budget, and it lacks skilled staff and modern tools to investigate corruption properly.",
      long: "Nepal's CIAA remains largely ineffective despite having strong legal powers on paper. The institution is vulnerable to political capture through politicized leadership, lacks operational independence, has narrowed jurisdiction, and weak institutional capacity. Despite extensive legal authority under Section 19 of the CIAA Act (including document seizure, arrest powers, and direct prosecution), its effectiveness is severely undermined by political appointment of commissioners, dependence on Finance Ministry for budget, reduced constitutional jurisdiction after 2015, and understaffed investigation units lacking advanced forensic and digital tools."
    },
    solution: {
      short: [
        "Give CIAA power to prosecute cases directly in court",
        "Allow CIAA to freeze corrupt officials' bank accounts during investigations", 
        "Make CIAA's budget independent from government control",
        "Select commissioners through competitive exams, not political appointments",
        "Protect commissioners from being fired for 5-8 years",
      ],
      long: {
        phases: [
          {
            phase: "Phase 1",
            title: "Immediate Statutory Reforms",
            items: [
              "Strengthen investigation & prosecution with integrated teams where legal experts work alongside investigators",
              "Enhanced powers through CIAA Act amendments for court-supervised asset freezing during investigations",
              "Clarify rules to remove 'policy decision' exemptions for ministers and restore jurisdiction over improper conduct",
              "Technological capabilities: digital evidence systems, financial tracking software, secure data management",
              "Professional staff expansion through competitive recruitment for investigators, forensic auditors, prosecutors",
              "Witness protection program with enhanced security protocols through Nepal Police coordination",
              "Performance accountability with public quarterly reports on case resolution times and conviction rates"
            ]
          },
          {
            phase: "Phase 2", 
            title: "Constitutional Reforms",
            items: [
              "Constitutional budget allocation independent from Finance Ministry (Article 238-239 amendment)",
              "Merit-based appointments: Chief Commissioner and Commissioners selected through competitive examination by independent panel",
              "Fixed tenure protection: 5-8 year terms to prevent capture while avoiding lifetime appointments",
              "Jurisdiction over corruption and improper conduct through amending Article 239",
              "Diverse expertise: recruit Commissioners from varied technical backgrounds"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Singapore's anti-corruption agency has 98% conviction rate because it's completely independent",
        "Hong Kong eliminated government corruption within 10 years using an independent commission",
        "Indonesia's anti-corruption commission achieves 77% conviction rate with major prosecutions",
      ],
      long: [
        {
          country: "Singapore",
          details: "CPIB achieved 98% conviction rate through complete independence, direct prosecution powers, and asset recovery authority",
          impact: "Critical sequencing: Singapore first strengthened powers through legislation (1952), then achieved full independence through constitutional protection (1965)"
        },
        {
          country: "Hong Kong", 
          details: "ICAC reformed gradually: 1974 initial legislation gave prosecution powers, 1997 constitutional entrenchment secured independence",
          impact: "Went from investigating 2,300 cases annually to virtually eliminating government corruption within a decade"
        },
        {
          country: "Indonesia",
          details: "KPK demonstrates phased approach: 2002 law created prosecution authority, 2004 constitutional amendment secured independence",
          impact: "77% conviction rate with major high-level prosecutions including ministers and governors"
        }
      ]
    },
    implementation: {
      short: [
        "First 6 months: Change laws to give CIAA prosecution powers and asset freezing authority",
        "Months 7-12: Set up special courts and hire qualified investigators",
        "Years 2-3: Build political support for constitutional changes",
        "Years 3-5: Complete constitutional amendment for full independence",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "CIAA Act Amendment and Legal Reforms",
          details: [
            "CIAA Act amendment for prosecution powers, asset freezing authority, expanded jurisdiction",
            "Collaboration with Office of Attorney General to second prosecutors until internal capacity developed", 
            "Specialized training: mandatory 6-7 month intensive training for investigation and prosecution staff",
            "Enhanced powers through court-supervised asset freezing during investigations"
          ]
        },
        {
          timeline: "Months 7-12", 
          description: "Institutional Capacity Building",
          details: [
            "Specialized courts establishment with reformed appointment of judges and faster timelines",
            "Professional staff recruitment through competitive hiring for investigators, forensic auditors, digital forensics specialists",
            "Digital capabilities deployment: evidence systems, financial tracking software, secure data management",
            "Performance safeguards: strict code of conduct, minimum two-year service terms, quarterly performance reports"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "Political Consensus Building", 
          details: [
            "Build political consensus for constitutional amendments on budget independence",
            "Demonstrate effectiveness of Phase 1 reforms to create momentum for constitutional changes",
            "Reform appointment procedures through constitutional amendment process",
            "Establish independent panel for merit-based Commissioner selection"
          ]
        },
        {
          timeline: "Years 3-5",
          description: "Constitutional Amendment and Full Independence",
          details: [
            "Constitutional amendment process for budget independence from Finance Ministry",
            "Full independence achievement with constitutional protection",
            "Merit-based appointment system operational with competitive examinations",
            "Fixed tenure protection preventing political capture"
          ]
        }
      ]
    },
    performanceTargets: [
      "Win 80% of corruption cases within 2 years",
      "Reduce case completion time from 3+ years to 6 months",
      "Take 90% of major corruption cases to court",
      "Recover 60% of stolen money in proven corruption cases",
    ],
    category: "Anti-Corruption",
    priority: "High",
    timeline: "5 years",
    legalFoundation: "Articles 238-239 of Constitution 2015, CIAA Act 2048 (1991)",
  },
  {
    id: "2",
    title: "Hold Fresh Elections Within 180 Days",
    description:
      "Conduct new parliamentary elections within 6 months with strict rules to ensure only qualified, honest candidates can run and all campaign money is transparent.",
    problem: {
      short: "The current government has lost people's trust. The election system allows criminals and corrupt people to run for office, and voters don't know where campaign money comes from.",
      long: "The current government has lost legitimacy and people no longer trust their representatives. The electoral system lacks proper vetting mechanisms to prevent candidates with criminal and corruption charges from running. Campaign finance transparency is absent, allowing hidden corporate donations and undisclosed spending. Voters lack access to candidate background information and campaign funding sources, undermining informed electoral choice and democratic accountability."
    },
    solution: {
      short: [
        "Dissolve parliament and hold elections within 180 days",
        "Ban candidates with criminal charges or corruption cases from running",
        "Require all campaign donations and spending to be published online daily",
        "Only allow individual people to donate money, no corporate donations",
        "Add 'None of the Above' option - if it wins, hold new elections with new candidates",
      ],
      long: {
        phases: [
          {
            phase: "Immediate",
            title: "Parliamentary Dissolution and Election Preparation",
            items: [
              "Parliamentary dissolution under Article 76(7) followed by immediate elections within 180 days",
              "Presidential dissolution considering political crisis and constitutional provisions",
              "Election Commission publishes detailed candidate profiles including education, experience, wealth sources",
              "Amend Electoral laws to disqualify candidates with pending corruption indictments and proven criminal charges"
            ]
          },
          {
            phase: "Campaign Finance Reform",
            title: "Transparency and Financial Controls", 
            items: [
              "Real-time campaign finance transparency with 24-hour disclosure requirement",
              "Ban corporate donations - only verified individual contributions allowed with strict limits",
              "Campaign spending limits with strict ceiling and live monitoring",
              "Public finance dashboard: Election Commission provides real-time tracking of all donations and expenditures",
              "Mandatory audited expense reports within 30 days with heavy penalties for violations"
            ]
          },
          {
            phase: "Electoral Innovation",
            title: "Democratic Choice Enhancement",
            items: [
              "NOTA option: If 'None of the Above' wins in constituency, re-election with entirely new candidates",
              "Voter education campaign: comprehensive candidate background disclosure, not just rally promises",
              "Multi-institutional verification across CIAA, Election Commission, and Auditor-General",
              "Public candidate vetting with supporting documentation required at nomination"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Ecuador allows president to dissolve parliament to break political deadlocks",
        "Canada requires real-time disclosure of donations over $200 within 3 days",
        "Countries with strict campaign finance rules have higher public trust in elections",
      ],
      long: [
        {
          country: "Ecuador",
          details: "Has 'Muerte Cruzada' mechanism that allows president to dissolve parliament but triggers fresh presidential elections too",
          impact: "Prevents abuse while resolving deadlocks. President Guillermo Lasso used this in 2023 to avoid impeachment and reset political system"
        },
        {
          country: "Canada",
          details: "Requires real-time disclosure of donations over $200 within 3 days of receipt",
          impact: "Creates transparency in campaign financing and enables real-time public scrutiny of political funding sources"
        },
        {
          country: "Australia", 
          details: "Mandates disclosure of all donations over $15,200 annually with strict reporting requirements",
          impact: "Countries with stricter campaign finance rules show higher public trust in elections and lower political corruption rates"
        }
      ]
    },
    implementation: {
      short: [
        "President dissolves parliament due to political crisis",
        "Election Commission publishes complete background checks on all candidates",
        "Change electoral laws to disqualify candidates with pending corruption cases",
        "Require candidates to submit audited expense reports within 30 days",
      ],
      long: [
        {
          timeline: "Day 1-30",
          description: "Parliamentary Dissolution and Legal Framework",
          details: [
            "Presidential dissolution of parliament considering political crisis under constitutional provisions",
            "Immediate Electoral Act amendments to implement candidate vetting and campaign finance transparency",
            "Election Commission preparation for enhanced candidate verification and real-time financial tracking",
            "Legal framework establishment for NOTA implementation and re-election procedures"
          ]
        },
        {
          timeline: "Day 31-90", 
          description: "Candidate Vetting and Campaign Preparation",
          details: [
            "Complete candidate background verification including criminal, corruption, and asset checks",
            "Publication of detailed candidate profiles with education, experience, wealth sources",
            "Campaign finance registration system launch with real-time tracking capabilities",
            "Voter education campaign launch on candidate backgrounds and NOTA option"
          ]
        },
        {
          timeline: "Day 91-150",
          description: "Campaign Period with Live Monitoring",
          details: [
            "Active campaign period with real-time donation and expenditure tracking",
            "Daily publication of campaign finance data with 24-hour disclosure requirement",
            "Continuous monitoring for compliance with spending limits and source restrictions",
            "Public candidate debates and forums with transparency requirements"
          ]
        },
        {
          timeline: "Day 151-180",
          description: "Election and Post-Election Accountability",
          details: [
            "Conduct elections with NOTA option and complete candidate choice",
            "Immediate post-election audited expense report submission within 30 days",
            "Investigation of any campaign finance violations with heavy penalties",
            "Re-election procedures if NOTA wins in any constituency"
          ]
        }
      ]
    },
    performanceTargets: [
      "Complete background verification for 100% of candidates",
      "Real-time tracking of all campaign donations and spending",
      "Zero tolerance for hidden campaign funding",
      "Complete electoral process within 180 days",
    ],
    category: "Electoral Reform",
    priority: "High",
    timeline: "180 days",
  },
  {
    id: "3",
    title: "Move Power from Kathmandu to Provinces and Local Areas",
    description:
      "Give real decision-making power and budget control to provincial and local governments so people don't have to go to Kathmandu for every approval.",
    problem: {
      short: "Everything gets decided in Kathmandu, creating long delays and opportunities for corruption. Every budget, project, and approval has to go through the center, making simple things complicated.",
      long: "Too much power concentrated in Kathmandu creates corruption bottlenecks and inefficiency. Every decision, budget allocation, and project approval must go through central government, creating opportunities for bribes and delays. Despite constitutional provisions for federalism in Schedules 5-9, implementation remains centralized. Citizens face bureaucratic delays for basic services, while local governments lack authority and resources to address community needs directly."
    },
    solution: {
      short: [
        "Implement constitutional powers already given to provinces and local governments",
        "Give 60% of national budget directly to provinces and local areas",
        "Let provinces keep 40% of taxes collected in their areas",
        "Allow municipalities to approve projects up to 50 crore without federal permission",
        "Let provinces hire and manage their own civil servants",
      ],
      long: {
        phases: [
          {
            phase: "Constitutional Implementation",
            title: "Enforce Existing Decentralization Provisions",
            items: [
              "Enforce constitutional decentralization through existing Schedules 5-9 that grant provinces and local governments exclusive powers",
              "Address jurisdictional ambiguities within constitutional schedules for health, education, and infrastructure",
              "Implement immediate administrative decentralization within 2 years using existing authority",
              "Transfer decision-making authority for day-to-day operations to appropriate government levels"
            ]
          },
          {
            phase: "Fiscal Decentralization", 
            title: "Budget and Revenue Transfer",
            items: [
              "60% budget decentralization with direct allocation to provinces and local levels",
              "Ring-fenced sector transfers to prevent federal reclaim of allocated funds",
              "40% provincial tax retention from income tax, VAT share, and natural resource royalties",
              "50 crore local approval authority for municipalities without federal sign-off",
              "Provincial revenue-sharing mandates with transparent allocation formulas"
            ]
          },
          {
            phase: "Administrative Autonomy",
            title: "Provincial and Local Government Capacity",
            items: [
              "Provincial civil service recruitment and management independent from federal control",
              "Federal role limited to monitoring performance rather than controlling day-to-day decisions",
              "Strategic project coordination maintained for national-level infrastructure",
              "Local government capacity building for effective service delivery"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Indonesia reduced central government dependency from 82% to 48% through decentralization",
        "Philippines increased local government funds by 55% through decentralization",
        "Switzerland makes most decisions at local level, creating efficient, clean government",
      ],
      long: [
        {
          country: "Indonesia",
          details: "'Big Bang' decentralization in 2001 transferred major powers directly to local governments",
          impact: "Reduced central dependency from 82% to 48% of subnational revenue by 2020. Local governments became more responsive and efficient with direct accountability to citizens"
        },
        {
          country: "Philippines",
          details: "Local Government Code with Mandanas Ruling increased local transfers significantly",
          impact: "Increased local transfers by 55% to ₱1.08 trillion (4.8% of GDP) in 2022, giving local governments real power and resources for development"
        },
        {
          country: "Switzerland",
          details: "Federal system where apart from foreign affairs and defense, most decisions made at cantonal and municipal levels",
          impact: "Creates one of world's least corrupt and most efficient governments through local accountability and reduced central bottlenecks"
        }
      ]
    },
    implementation: {
      short: [
        "Use existing constitutional provisions and change federal laws immediately",
        "Complete administrative transfer to local governments within 2 years",
        "Transfer budget authority to provinces and local governments",
        "Set up provincial civil service systems",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Legal Framework and Administrative Preparation",
          details: [
            "Enforce existing constitutional provisions through amended federal laws",
            "Clarify jurisdictional ambiguities in Schedules 5-9 through legal interpretation",
            "Prepare administrative systems for power and budget transfer",
            "Establish coordination mechanisms between federal, provincial, and local levels"
          ]
        },
        {
          timeline: "Months 7-18",
          description: "Fiscal and Administrative Transfer", 
          details: [
            "Immediate administrative decentralization with authority transfer to local levels",
            "Begin budget allocation transfer with 60% direct allocation to subnational governments",
            "Implement 40% provincial tax retention system for locally collected revenues",
            "Establish 50 crore approval authority for all municipalities"
          ]
        },
        {
          timeline: "Months 19-24",
          description: "Capacity Building and System Optimization",
          details: [
            "Establish provincial civil service systems for recruitment and management",
            "Complete budget allocation authority transfer to provinces and local governments",
            "Monitor implementation effectiveness and adjust systems as needed",
            "Ensure 100% compliance with constitutional decentralization mandates"
          ]
        }
      ]
    },
    performanceTargets: [
      "Transfer 60% of national budget to local levels",
      "Provinces keep 40% of taxes within 3 years",
      "All municipalities get 50 crore approval authority",
      "100% compliance with constitutional decentralization requirements",
    ],
    category: "Federalism",
    priority: "High",
    timeline: "2 years",
  },
  {
    id: "4",
    title: "Require All Politicians to Declare Their Wealth Publicly",
    description:
      "Force all politicians and candidates to publish their complete assets online so citizens can see how they become rich on government salaries.",
    problem: {
      short: "Politicians become millionaires while earning modest government salaries, but nobody knows where their wealth comes from. This enables corruption and destroys public trust.",
      long: "Politicians accumulate substantial wealth on modest government salaries without transparency about sources, enabling corruption and undermining public trust. Current asset declaration systems are confidential rather than public, preventing citizen oversight. Lack of automatic investigation triggers for unexplained wealth increases allows corruption to go undetected. Multi-institutional verification is absent, making false declarations easy to hide."
    },
    solution: {
      short: [
        "Publish all politician assets online within 7 days in searchable format",
        "Require candidates to declare all assets before they can run for office",
        "Demand supporting documents like property deeds and bank statements",
        "Automatically investigate anyone whose wealth increases by 50% in one year",
        "Have multiple agencies cross-check declarations against tax and bank records",
      ],
      long: {
        phases: [
          {
            phase: "Digital Transparency",
            title: "Public Asset Declaration System",
            items: [
              "Public digital portal with all politician asset declarations published online in searchable, downloadable format within 7 days",
              "Candidate disclosure at nomination with supporting documentation including title deeds, bank statements, purchase invoices",
              "Complete asset information covering property inside and outside Nepal, business interests, investments",
              "Real-time updates for any significant asset changes or acquisitions during tenure"
            ]
          },
          {
            phase: "Verification and Investigation",
            title: "Automated Oversight Mechanisms",
            items: [
              "Automatic red-flag triggers for 50% annual wealth increase or large unexplained purchases",
              "Multi-institutional verification across CIAA, Election Commission, and Auditor-General",
              "Cross-checking declarations against tax records, bank data, and public registries",
              "Annual wealth audits by Auditor-General for Cabinet ministers and high-risk officials"
            ]
          },
          {
            phase: "Accountability and Sanctions",
            title: "Enforcement Framework",
            items: [
              "Clear sanctions ladder: failure to file = immediate disqualification; false declaration = criminal investigation",
              "Asset forfeiture for proven false declarations with criminal prosecution",
              "CIAA investigation authority for all wealth increase red-flags",
              "Public complaint system for citizens to report suspected asset concealment"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Ukraine's digital asset system processes over 1 million declarations annually",
        "93% of countries require cabinet asset disclosure, but only 43% make it public",
        "Digital transparency led to prosecution of 5,131 civil servants for corruption by 2020",
      ],
      long: [
        {
          country: "Ukraine",
          details: "Electronic asset declaration system processes over 1 million declarations annually with 72% public approval",
          impact: "Automatic verification led to prosecution of 5,131 civil servants for corruption by 2020, demonstrating power of digital transparency"
        },
        {
          country: "Global Comparison",
          details: "93% of countries require cabinet members to disclose assets, but only 43% provide public access",
          impact: "Disclosure without transparency is ineffective - public scrutiny creates accountability that confidential filing cannot achieve"
        },
        {
          country: "Digital Success Cases",
          details: "Countries with online asset declaration systems show significantly higher prosecution rates for corruption",
          impact: "Digital signatures and automated verification save institutions money while enabling continuous monitoring rather than periodic checks"
        }
      ]
    },
    implementation: {
      short: [
        "Give current politicians 60 days to comply or face disqualification",
        "Launch public portal within 6 months",
        "Change laws to require public disclosure instead of confidential filing",
        "Create central portal coordinated by anti-corruption agencies",
      ],
      long: [
        {
          timeline: "Days 1-60",
          description: "Immediate Compliance Requirement",
          details: [
            "All current politicians have 60 days to comply with full asset disclosure or face disqualification",
            "Emergency amendment to Prevention of Corruption Act replacing confidentiality with public disclosure",
            "Coordination between CIAA, Election Commission, and Auditor-General for verification system",
            "Legal framework establishment for automatic investigation triggers"
          ]
        },
        {
          timeline: "Months 3-6",
          description: "Digital Platform Development",
          details: [
            "Central asset declaration portal development with searchable, downloadable format",
            "Integration with existing government databases for cross-verification",
            "Public portal operational with complete politician asset information",
            "Mobile-friendly interface with citizen search and monitoring capabilities"
          ]
        },
        {
          timeline: "Months 6-12",
          description: "Full System Operation and Monitoring",
          details: [
            "Automatic red-flag system operational for wealth increase monitoring",
            "Regular audit cycles by Auditor-General for high-risk officials",
            "Public complaint system for citizen reporting of suspected concealment",
            "Performance measurement and system optimization based on early results"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% politician compliance with asset disclosure within 60 days",
      "Public portal operational with downloadable data",
      "Investigate all suspicious wealth increases automatically",
      "Criminal prosecution for false declarations",
    ],
    category: "Transparency",
    priority: "High",
    timeline: "6 months",
  },
  {
    id: "5",
    title: "Set Minimum Qualifications for Ministers and MPs",
    description:
      "Require government ministers to have education and experience relevant to their jobs instead of choosing them based only on political loyalty.",
    problem: {
      short: "Ministers and MPs are chosen through political deals rather than qualifications, leading to poor governance and waste of public resources.",
      long: "Ministers and MPs are often chosen through political bargaining rather than expertise, leading to governance failures and resource waste. The Constitution promises accountable, effective leadership but lacks enforcement mechanisms for competency requirements. Political loyalty trumps sectoral knowledge, resulting in ministers managing complex portfolios without relevant education or experience, undermining policy effectiveness and public service delivery."
    },
    solution: {
      short: [
        "Pass law requiring ministers to have relevant education or experience",
        "Require either: Bachelor's degree + 3 years experience OR 10+ years sector experience",
        "Health Minister must have medical or public health background",
        "Finance Minister must have economics, finance, or banking experience",
        "Prime Minister must justify all ministerial appointments to Parliament in writing",
      ],
      long: {
        phases: [
          {
            phase: "Legislative Framework",
            title: "Ministerial Qualifications Act",
            items: [
              "Parliament passes law requiring sectoral expertise for specific portfolios through simple majority",
              "Education OR Experience standard: Bachelor's degree + 3 years proven experience OR 10+ years sector experience",
              "Specific requirements: Health Minister needs medical/public health background, Finance Minister requires economics/finance education or banking experience",
              "Parliamentary justification requirement: PM must justify all ministerial appointments to Parliament in writing",
              "Minimum 5 years leadership experience requirement for all ministerial positions"
            ]
          },
          {
            phase: "Implementation and Enforcement",
            title: "Application and Monitoring",
            items: [
              "Immediate implementation for all new appointments with published justification requirements",
              "Fair baseline compensation aligned with senior civil service levels to attract qualified candidates",
              "Public verification system for claimed qualifications and experience",
              "Parliamentary oversight committee to review and approve ministerial qualifications"
            ]
          },
          {
            phase: "Constitutional Protection",
            title: "Long-term Institutional Security",
            items: [
              "Long-term goal of constitutional amendment for permanent protection of qualification requirements",
              "Build political consensus for constitutional entrenchment of competency standards",
              "Prevent future governments from easily reversing qualification requirements",
              "Establish precedent of merit-based appointments in executive branch"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "UK cabinet has 91% university-educated members despite no formal requirements",
        "India's 2014 cabinet had 91% graduates through political pressure for competence",
        "Political systems naturally improve when voters demand qualified leaders",
      ],
      long: [
        {
          country: "United Kingdom",
          details: "UK cabinet shows 91% university-educated members despite no formal constitutional requirements",
          impact: "Demonstrates how political incentives naturally drive qualification levels when public and media scrutiny demands competence in governance"
        },
        {
          country: "India",
          details: "India's 2014 cabinet had 91% graduates through political incentives for competence rather than legal mandates",
          impact: "Shows that political systems can drive qualification improvements when electoral consequences favor competent leadership over pure loyalty"
        },
        {
          country: "Global Trends",
          details: "Political systems naturally drive qualification levels higher when voters and institutions demand competence",
          impact: "Countries with educated publics and strong media scrutiny tend to produce more qualified cabinets even without formal requirements"
        }
      ]
    },
    implementation: {
      short: [
        "Pass Ministerial Qualifications Act through Parliament (simple majority needed)",
        "Apply immediately to all new appointments",
        "Work toward constitutional amendment for permanent protection",
        "Set fair compensation to attract qualified people",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Legislative Process and Legal Framework",
          details: [
            "Draft and introduce Ministerial Qualifications Act in Parliament with specific sectoral requirements",
            "Build parliamentary coalition for passage through simple majority rather than constitutional amendment",
            "Define clear qualification standards for each ministerial portfolio with flexibility for equivalent experience",
            "Establish verification mechanisms for claimed qualifications and experience"
          ]
        },
        {
          timeline: "Months 7-12",
          description: "Implementation and Application",
          details: [
            "Immediate implementation for all new ministerial appointments with published qualification verification",
            "Parliamentary justification system operational requiring written explanation for all appointments",
            "Fair compensation system aligned with senior civil service to attract qualified candidates",
            "Public database of ministerial qualifications and justifications for transparency"
          ]
        },
        {
          timeline: "Years 2-5",
          description: "Institutional Strengthening and Constitutional Protection",
          details: [
            "Build political consensus for constitutional amendment providing permanent protection",
            "Monitor effectiveness of qualification requirements on governance outcomes",
            "Expand qualification requirements to other senior positions based on success",
            "Constitutional amendment process to prevent future reversal of competency standards"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% of ministers meet qualification requirements within 1 year",
      "Parliamentary justification published for all appointments",
      "Competitive compensation aligned with senior civil service",
      "Zero appointments based only on party loyalty",
    ],
    category: "Governance",
    priority: "High",
    timeline: "1 year",
  },
  {
    id: "6",
    title: "Reform Constitution for Stable Government",
    description:
      "Create independent oversight of government appointments, strengthen anti-corruption powers, and work toward long-term constitutional changes for political stability.",
    problem: {
      short: "Nepal's parliamentary system creates constant instability, frequent government collapses, and allows unqualified party loyalists to become ministers without independent review.",
      long: "Nepal's parliamentary system creates chronic instability, frequent coalition collapses, and allows unqualified party loyalists to become ministers without independent checks. There are no independent mechanisms to review executive appointments, insufficient separation of powers to prevent abuse, and weak institutional capacity to ensure continuity during political transitions. The system lacks overseas voting for diaspora participation and needs stronger accountability mechanisms."
    },
    solution: {
      short: [
        "Create independent commission to review all ministerial appointments publicly",
        "Require education and experience standards for all ministers",
        "Give anti-corruption commission independent prosecution powers",
        "Allow overseas Nepalis to vote in elections",
        "Long-term goal: Direct presidential elections separate from legislature",
      ],
      long: {
        phases: [
          {
            phase: "Phase 1",
            title: "Immediate Statutory Reforms",
            items: [
              "Independent Commission on Executive Appointments (ICEA) with advisory powers and mandatory public vetting",
              "Ministerial Qualifications Act with education/experience requirements for all portfolios",
              "Enhanced CIAA powers with independent prosecution wing through CIAA Act amendment",
              "Overseas voting implementation through Election Commission regulation and embassy infrastructure",
              "All reforms achievable through simple Parliamentary acts within 6-12 months"
            ]
          },
          {
            phase: "Phase 2",
            title: "Long-term Constitutional Goals",
            items: [
              "Direct Presidential Elections requiring constitutional amendment but providing stability precedent from France, South Korea",
              "Separation of Executive/Legislative where ministers cannot simultaneously be MPs",
              "Constitutional amendment in Article 78 ensuring professional governance over political loyalties",
              "Constitutional budget protection for independent institutions",
              "Requires broad political consensus and 2/3 Parliamentary majority over 2-5 years"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Singapore's merit-based appointment system contributed to 100x GDP growth over 60 years",
        "South Korea's 1987 constitutional reforms created stable democratic institutions",
        "Estonia combined immediate reforms with long-term constitutional development",
      ],
      long: [
        {
          country: "Singapore",
          details: "Statutory Public Service Commission (1951) created merit-based appointments without constitutional change",
          impact: "Contributed to 100x GDP growth over 60 years by ensuring competent administration and policy continuity"
        },
        {
          country: "South Korea",
          details: "1987 constitutional reforms required years of political consensus-building but established direct elections and independent institutions",
          impact: "Supported economic miracle and democratic consolidation through stable governance structures and professional administration"
        },
        {
          country: "Estonia",
          details: "Post-independence institutional reforms combined immediate statutory changes with longer-term constitutional development",
          impact: "Created efficient digital government and stable democracy through phased approach to institutional strengthening"
        }
      ]
    },
    implementation: {
      short: [
        "Phase 1 (0-12 months): Create appointment commission, pass qualification laws",
        "Phase 2 (2-5 years): Build political consensus for constitutional amendments",
        "Show that immediate reforms work before proposing constitutional changes",
        "Gradual implementation with measurable results at each phase",
      ],
      long: [
        {
          timeline: "Months 0-12",
          description: "Phase 1: Immediate Statutory Reforms",
          details: [
            "ICEA establishment through Parliamentary legislation with advisory powers and public vetting requirements",
            "Ministerial Qualifications Act passage with sectoral expertise requirements",
            "CIAA strengthening through enhanced prosecution powers and budget independence",
            "Overseas voting implementation through Election Commission infrastructure development"
          ]
        },
        {
          timeline: "Years 1-2",
          description: "Demonstration of Reform Effectiveness",
          details: [
            "ICEA operational with public vetting of all ministerial nominees and published scorecards",
            "100% ministerial appointments meeting qualification standards with parliamentary justification",
            "Enhanced CIAA prosecution capabilities operational with increased conviction rates",
            "Overseas voting successful implementation for diaspora political participation"
          ]
        },
        {
          timeline: "Years 2-5",
          description: "Phase 2: Constitutional Amendment Process",
          details: [
            "Build political consensus for constitutional amendments based on Phase 1 success",
            "Direct presidential election amendment process with broad stakeholder consultation",
            "Executive/legislative separation constitutional changes for professional governance",
            "Constitutional protection for independent institutions and merit-based appointments"
          ]
        }
      ]
    },
    performanceTargets: [
      "Independent commission reviews all ministerial appointments publicly",
      "100% ministerial appointments meet qualification standards",
      "Anti-corruption commission gets prosecution powers within 12 months",
      "Build political consensus for constitutional amendments",
    ],
    category: "Constitutional Reform",
    priority: "High",
    timeline: "5 years",
  },
  {
    id: "7",
    title: "Put All Government Services Online",
    description:
      "Create a unified digital system where citizens can access all government services online 24/7, eliminating corruption and bureaucratic delays.",
    problem: {
      short: "Government systems don't work together, forcing citizens to submit the same documents multiple times. Many services are still manual, creating delays and opportunities for corruption.",
      long: "Government systems are fragmented and lack interoperability, creating inefficiencies, duplication, and limited transparency. Citizens face manual processes, repeated document submissions, and exclusion of technologically disadvantaged populations. Core services like driving license renewal and land verification operate on different non-standardized digital processes, while essential citizen-facing services like grievance filing remain manual, limiting accessibility and accountability."
    },
    solution: {
      short: [
        "Connect all government computer systems so they can share information",
        "Create national digital standards and cybersecurity center",
        "Build single website (Nepal.gov.np) for all government services",
        "Use national ID cards for all government services",
        "Provide 24/7 AI chatbot to help citizens navigate services",
      ],
      long: {
        phases: [
          {
            phase: "Infrastructure Development",
            title: "Digital Public Infrastructure",
            items: [
              "National Digital Framework with shared standards and decentralized ownership allowing each government entity to maintain systems with interoperability",
              "National E-Governance Service Center (NESGC) under Ministry of Communications & IT for design standards and cybersecurity",
              "Secure data servers with geo-distributed network, disaster recovery, and annual third-party security audits",
              "Digital financial infrastructure with universal payment gateways for fee collection and welfare distribution"
            ]
          },
          {
            phase: "Service Integration",
            title: "Unified Citizen Services",
            items: [
              "Unified One-Stop Portal (Nepal.gov.np) expansion for all government services with end-to-end digital processing",
              "National Digital Identity integration across all services for single source of truth",
              "Data-sharing layer with secure APIs eliminating duplicate submissions and manual verifications",
              "AI-powered citizen support center with 24/7 virtual assistance and multi-language accessibility"
            ]
          },
          {
            phase: "Accountability and Inclusion",
            title: "Governance and Access",
            items: [
              "Legal reforms to Good Governance Act and Right to Information Act with prosecutorial provisions",
              "Assisted Digital Service Desks at ward offices for citizens lacking digital literacy",
              "Mandatory publication of eligibility, required documents, fees, and timelines for every service",
              "Innovation sandboxes for testing AI, blockchain, and advanced analytics safely"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Estonia provides 100% of services online, saving citizens 1,400 years annually",
        "India's digital system eliminated 25 million fake beneficiaries, saving ₹3.5 lakh crore",
        "Digital signatures alone save €2,700 per year for institutions",
      ],
      long: [
        {
          country: "Estonia",
          details: "Achieved 100% online service availability using institutional frameworks similar to proposed NESGC",
          impact: "Saves citizens 1,400 years of working time annually while achieving 95% citizen trust in government financial management"
        },
        {
          country: "India",
          details: "JAM Trinity (banking + biometric + mobile) eliminated fraud while processing massive transaction volumes",
          impact: "Eliminated 25 million false beneficiaries saving ₹3.5 lakh crore, while processing 40% of global real-time payments"
        },
        {
          country: "Global Digital Government",
          details: "Digital signatures and automated systems show consistent cost savings across institutions",
          impact: "Digital signatures alone save €2,700 per year for institutions while reducing processing time by 40-60%"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-6: Set up digital standards center and expand government portal",
        "Months 7-18: Connect all ministries, train staff, deploy help systems",
        "Months 19-24: Launch full service availability and accountability systems",
        "Change laws to require efficient service delivery with penalties for delays",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Infrastructure and Standards Establishment",
          details: [
            "NESGC establishment under Ministry of Communications & IT with cybersecurity protocols",
            "National digital framework development with shared standards for interoperability",
            "Nepal.gov.np portal expansion planning with user-centric design principles",
            "Legal framework preparation for Good Governance Act and Right to Information Act amendments"
          ]
        },
        {
          timeline: "Months 7-18",
          description: "System Integration and Capacity Building",
          details: [
            "Ministry integration with data-sharing APIs and secure interconnected systems",
            "Civil servant training on digital governance through Nepal Administrative Staff College",
            "Municipal digital help desk deployment with trained staff for citizen assistance",
            "AI-powered citizen support center development with multi-language capabilities"
          ]
        },
        {
          timeline: "Months 19-24",
          description: "Full Service Launch and Accountability",
          details: [
            "100% government services available online with automatic timeline tracking",
            "Accountability mechanisms with penalty systems for service delivery delays",
            "Digital governance authority establishment for monitoring service quality",
            "Innovation sandbox implementation for testing advanced technologies safely"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% government services available online within 24 months",
      "90% of service requests completed within published timelines",
      "24/7 virtual assistant handles 80% of citizen questions",
      "Complete elimination of duplicate document submissions",
    ],
    category: "Digital Governance",
    priority: "High",
    timeline: "2 years",
  },
  {
    id: "8",
    title: "Make Public Contracts Transparent and Fair",
    description:
      "Reform government procurement to eliminate corruption by requiring independent verification, fair bidding processes, and real-time public tracking of all contracts.",
    problem: {
      short: "Government contracts often go to pre-selected companies through biased specifications and corrupt practices. The lowest bidder system often results in poor quality work.",
      long: "Public procurement faces systemic challenges including biased bid documentation, flawed awarding systems, and lack of transparency enabling corruption and inefficiency. Technical specifications are often written to favor particular vendors, limiting fair competition. Unverified budgetary requirements and automatic lowest-bidder selection compromise quality and enable cartels. Real-time tracking and accountability mechanisms are absent."
    },
    solution: {
      short: [
        "Have independent auditors verify all bid documents to ensure fairness",
        "Award contracts based on average bid price, not just lowest price",
        "Require electronic bidding for all contracts above Rs. 500,000",
        "Publish all contract details and payments online in real-time",
        "Enforce strict penalties and automatic bans for companies that fail to deliver",
      ],
      long: {
        phases: [
          {
            phase: "Verification and Documentation",
            title: "Independent Bid Document Verification",
            items: [
              "Independent bid document verification through third-party audits across all procurement categories",
              "Mandatory pre-procurement assessment for necessity, scale, and feasibility of proposed projects",
              "Independent review panels ensuring technical specifications are neutral and promote fair participation",
              "Random sampling audits of procurement notices to deter malpractice in specification design"
            ]
          },
          {
            phase: "Bidding and Award Reform",
            title: "Mean-Based Awarding System",
            items: [
              "Replace lowest-bidder approach with mean-based awarding where winning bid selected based on proximity to average",
              "Enhanced transparency with detailed tender criteria published 30 days before bidding",
              "Live-streamed bid opening for contracts above Rs. 50 lakh with public access",
              "Mandatory disclosure of beneficial ownership for all bidding companies"
            ]
          },
          {
            phase: "Digital Platform and Accountability",
            title: "Electronic Procurement and Monitoring",
            items: [
              "Mandatory electronic procurement platform for all contracts above Rs. 500,000 with PPMO system upgrade",
              "Real-time publication of all procurement processes, payments, and project progress",
              "Contractor performance database with historical records accessible to government and public",
              "Strict accountability with performance bonds and automatic debarment system for failures"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Rwanda's digital system increased bidders per tender from 2.1 to 4.2 participants",
        "Estonia achieved 96% electronic procurement with 40% time reduction",
        "Georgia's reforms reduced infrastructure costs by 30-50% while eliminating cartels",
      ],
      long: [
        {
          country: "Rwanda",
          details: "UMUCYO system processes 100% of contracts above $20,000 with full transparency",
          impact: "Average of 4.2 bidders per tender vs. 2.1 before digitization, and 15% average cost savings through increased competition"
        },
        {
          country: "Estonia",
          details: "Achieved 96% electronic procurement with centralized monitoring and digital systems",
          impact: "3.6 tenderers per electronic procedure vs. 1.9 for paper-based, with 40% time reduction and increased competition"
        },
        {
          country: "Georgia",
          details: "Procurement reforms (2004-2012) combined electronic systems with strict penalties",
          impact: "Reduced infrastructure costs by 30-50% while eliminating bid-rigging cartels through systematic reform"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-6: Upgrade procurement systems and change laws",
        "Months 7-12: Roll out starting with central ministries",
        "Year 2: Full implementation including local governments with monitoring",
        "Independent audits by Auditor General of all major contracts",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "System Upgrade and Legal Framework",
          details: [
            "PPMO e-GP system upgrade for interoperability with national digital infrastructure",
            "Legal amendments to Public Procurement Act for mean-based awarding and transparency requirements",
            "Third-party audit system establishment for bid document verification",
            "Staff training for procurement officials on new procedures and accountability measures"
          ]
        },
        {
          timeline: "Months 7-12",
          description: "Phased Implementation and Capacity Building",
          details: [
            "Phased rollout starting with central ministries for system testing and refinement",
            "Electronic procurement platform deployment for all contracts above Rs. 500,000",
            "Real-time publication system for tender notices, evaluation criteria, and contract awards",
            "Contractor performance database development with historical tracking capabilities"
          ]
        },
        {
          timeline: "Year 2",
          description: "Full Implementation and Performance Monitoring",
          details: [
            "Full implementation including provincial and local governments with integrated monitoring",
            "Independent procurement audits by Auditor General with public hearings for violations",
            "Citizen complaint portal operational with 30-day mandatory response timeline",
            "Performance measurement system tracking bidder participation, cost savings, and completion rates"
          ]
        }
      ]
    },
    performanceTargets: [
      "Average 3+ bidders per contract for all government projects",
      "15% cost savings compared to previous years",
      "80% of projects completed on time as contracted",
      "90% of citizen complaints resolved within 30 days",
    ],
    category: "Procurement Reform",
    priority: "High",
    timeline: "2 years",
  },
  {
    id: "9",
    title: "Break Monopolies and Protect Consumers",
    description:
      "Stop monopolistic business practices through strong competition enforcement, temporary import relaxation, and consumer protection courts in every district.",
    problem: {
      short: "Business associations control prices and supply chains without competition. Weak enforcement allows cartels to operate freely, making everything expensive for ordinary people.",
      long: "Monopolistic practices are widespread through unregulated associations controlling prices and supply chains. Transport associations set fares and restrict routes, while agricultural middlemen control prices leaving farmers with minimal value. Despite Competition Promotion and Market Protection Act (2007) prohibiting such practices, weak enforcement, low penalties, and judicial bias allow cartels to operate unchecked. Consumer protection gaps leave citizens without effective remedies."
    },
    solution: {
      short: [
        "Give Competition Commission power to investigate and punish cartels",
        "Temporarily allow easier imports of monopolized goods to increase competition",
        "Create Small Importer License for individuals and small businesses",
        "Set up consumer courts in every district with penalty powers",
        "Heavy fines for businesses selling above Maximum Retail Price",
      ],
      long: {
        phases: [
          {
            phase: "Import Liberalization",
            title: "Temporary Competition Enhancement",
            items: [
              "Temporarily ease import restrictions on goods where monopolies inflate prices (cooking gas, food, medication)",
              "Small Importer License: simplified digital licensing for individuals (NPR 30,000/month) and SMEs (NPR 9.5 million/year)",
              "Implement monitoring mechanisms to prevent smuggling while maintaining safety standards",
              "Category restrictions: medicines meet Department of Drug Administration standards, gas safety certification"
            ]
          },
          {
            phase: "Competition Law Enforcement",
            title: "Strengthen Competition Commission",
            items: [
              "Investigate cartels and dominant firms abusing market power with enhanced authority",
              "Impose antitrust and structural remedies to large conglomerates where necessary",
              "Cross-check companies' international compliance to prevent blacklisted firm entry",
              "Encourage whistleblowers with legal protection and financial incentives for reporting"
            ]
          },
          {
            phase: "Consumer Protection",
            title: "District-Level Consumer Courts and Monitoring",
            items: [
              "Consumer courts in every district with power to impose penalties and regular service checks",
              "Price monitoring with heavy fines for selling above Maximum Retail Price",
              "Citizen awareness campaigns on rights, price checks, and reporting channels",
              "Crowdsourced monitoring apps for citizens to report overpricing or cartel activity"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "South Korea's competition enforcement after 1997 coincided with economic growth acceleration",
        "India's Competition Act 2002 supported economic liberalization and GDP growth",
        "Countries with strong competition policy show higher manufacturing growth",
      ],
      long: [
        {
          country: "South Korea",
          details: "Transformed from protecting large business groups (chaebols) in 1970s to serious competition enforcement post-1997",
          impact: "Coincided with transition from developing to developed economy, manufacturing growing from 10.4% to 22.6% of GDP"
        },
        {
          country: "India",
          details: "Replaced old monopoly protection law with Competition Act in 2002 during economic liberalization",
          impact: "Paralleled economic liberalization and GDP growth acceleration through increased market competition"
        },
        {
          country: "Global Evidence",
          details: "Countries with strong competition policy frameworks consistently show higher manufacturing growth rates",
          impact: "Demonstrates correlation between effective competition enforcement and economic development outcomes"
        }
      ]
    },
    implementation: {
      short: [
        "Months 0-6: Issue temporary import relaxation order and digital permit system",
        "Months 7-12: Track imports with monitoring and safety audits",
        "Year 1: Assess impact on competition and prices",
        "Year 2: Full evaluation and policy adjustment based on results",
      ],
      long: [
        {
          timeline: "Months 0-6",
          description: "Temporary Import Liberalization and System Setup",
          details: [
            "Draft and issue Temporary Import Liberalization Order for monopolized essential goods",
            "Launch digital SME/individual permit system with simplified one-page application process",
            "Establish monitoring framework with mandatory customs e-filing and cross-checking systems",
            "Set up blacklist system for traders who exceed thresholds or misdeclare goods"
          ]
        },
        {
          timeline: "Months 7-12",
          description: "Monitoring and Enforcement Implementation",
          details: [
            "Track imports with enforced barcoding and publish open dashboards for transparency",
            "Conduct safety and smuggling risk audits with regular compliance monitoring",
            "Competition Commission begins enhanced cartel investigations with new authority",
            "Consumer court establishment in districts with penalty powers and staff training"
          ]
        },
        {
          timeline: "Year 1-2",
          description: "Assessment and Policy Optimization",
          details: [
            "Assess impact on local production, competition levels, and consumer prices",
            "Conduct full evaluation of liberalization effects on market competition",
            "Decide on extension, modification, or termination of liberalization based on results",
            "Optimize consumer protection mechanisms based on early performance data"
          ]
        }
      ]
    },
    performanceTargets: [
      "30% average price reduction in essential goods within 18 months",
      "500% increase in registered small importers",
      "50% reduction in consumer complaints about monopolistic pricing",
      "Consumer courts operational in 100% of districts",
    ],
    category: "Competition Policy",
    priority: "Medium",
    timeline: "2 years",
  },
  {
    id: "10",
    title: "Transform Public Transportation with Smart Planning",
    description:
      "Create efficient public transport through dedicated bus lanes, massive electric bus expansion, intelligent traffic systems, and integrated payment systems.",
    problem: {
      short: "Traffic chaos, pollution, and unreliable public transport create daily hardships for citizens and hurt the economy through lost time and health costs.",
      long: "Traffic chaos, pollution, and unreliable public transportation create daily hardships for citizens and economic inefficiency. Urban areas lack integrated transport planning, while coordination failures between road construction and utility work create chronic infrastructure problems. Public transport coverage is inadequate with poor frequency and reliability, forcing over-reliance on private vehicles and contributing to air pollution and lost productivity."
    },
    solution: {
      short: [
        "Build dedicated lanes: 2 for electric buses, 2 for walking/cycling, 2 for private vehicles",
        "Expand Sajha Yatayat: 1 electric bus per 500-1,000 urban residents",
        "Install intelligent traffic lights that give priority to buses using GPS",
        "Create unified payment system with cards and mobile apps for all transport",
        "Provide real-time GPS tracking so people know when buses will arrive",
      ],
      long: {
        phases: [
          {
            phase: "Smart Infrastructure Design",
            title: "Multi-Modal Transportation Infrastructure",
            items: [
              "Multi-modal dedicated lanes: 2 lanes electric buses, 2 lanes walking/cycling, 2 lanes private vehicles",
              "Strict enforcement with camera monitoring and automatic fines for lane violations",
              "Intelligent traffic lights GPS-linked to bus locations for priority flow optimization",
              "Transfer hubs at major intersections with sheltered waiting areas and integrated ticketing"
            ]
          },
          {
            phase: "Fleet Expansion and Service Quality",
            title: "Massive Sajha Yatayat Transformation",
            items: [
              "Fleet expansion target: 1 electric bus per 500-1,000 urban residents in Kathmandu and Pokhara",
              "Integrated fare system with card-based and mobile app ticketing across all buses and vans",
              "Public-private partnerships for rapid coverage expansion with dedicated budget lines",
              "Performance-based payments: operator compensation linked to punctuality and reliability metrics"
            ]
          },
          {
            phase: "Service Integration and Accountability",
            title: "Comprehensive Transport System",
            items: [
              "Frequency targets: buses every 5 minutes on major routes, electric vans every 10-15 minutes on secondary roads",
              "Real-time tracking with public GPS app showing live bus locations and arrival times",
              "Infrastructure accountability: pre-construction planning and utilities synchronization mandate",
              "Public participation framework with mandatory city-wide consultations and environmental assessments"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Bogotá's bus system reduced travel time by 32% and air pollution by 40%",
        "Curitiba's bus system serves 70-80% of commuters at $200,000 per km vs. $90 million for subways",
        "Lagos bus system reduced travel time by 40% and CO₂ by 13% while cutting fares 30%",
      ],
      long: [
        {
          country: "Bogotá, Colombia",
          details: "TransMilenio achieved 32% travel time reduction and carries 1.6 million daily passengers",
          impact: "40% air pollution reduction through dedicated lanes and integrated systems while serving major urban population"
        },
        {
          country: "Curitiba, Brazil",
          details: "Integrated BRT system serves 70-80% of commuters with construction costs of $200,000 per kilometer",
          impact: "Compared to $90 million for subways, achieved 25% lower per capita emissions through systematic approach"
        },
        {
          country: "Lagos, Nigeria",
          details: "BRT system implementation with dedicated lane enforcement and fleet electrification",
          impact: "Reduced travel time by 40% and CO₂ emissions by 13% while cutting passenger fares by 30%"
        }
      ]
    },
    implementation: {
      short: [
        "Year 1: Plan routes, conduct environmental studies, buy bus fleets",
        "Year 2: Build major routes, install GPS systems, launch integrated ticketing",
        "Year 3: Full network operation, optimize performance, plan expansion",
      ],
      long: [
        {
          timeline: "Year 1",
          description: "Planning and Infrastructure Preparation",
          details: [
            "Comprehensive route planning with GIS and traffic simulation modeling for evidence-based optimization",
            "Environmental impact assessments required under Environmental Protection Act compliance",
            "Fleet procurement for electric buses and e-rickshaws with pilot corridor implementation",
            "Public consultation framework with mandatory city-wide consultations before major route implementation"
          ]
        },
        {
          timeline: "Year 2",
          description: "Infrastructure Implementation and System Integration",
          details: [
            "Major route implementation with dedicated multi-modal lanes and transfer hubs",
            "GPS systems installation with intelligent traffic light integration for bus priority",
            "Integrated ticketing system launch with card-based and mobile app functionality",
            "Performance monitoring system deployment for real-time service tracking"
          ]
        },
        {
          timeline: "Year 3",
          description: "Full Network Operation and Optimization",
          details: [
            "Full network operation with 90% on-time performance targets and frequency standards",
            "Performance optimization based on ridership data and citizen feedback",
            "Expansion planning for additional routes and service improvements",
            "System evaluation and refinement for long-term sustainability"
          ]
        }
      ]
    },
    performanceTargets: [
      "40% reduction in average commute times within 3 years",
      "80% of urban residents within 500m of reliable public transport",
      "50% reduction in private vehicle use during peak hours",
      "90% on-time performance for scheduled services",
    ],
    category: "Transportation",
    priority: "Medium",
    timeline: "3 years",
  },
  {
    id: "11",
    title: "Ensure Quality Education for All Nepalis",
    description:
      "Transform education through expanded government schools, qualified teachers, practical skills training, and digital learning to ensure every child gets quality education.",
    problem: {
      short: "Rural areas lack quality schools while private schools exploit families. Government schools have unqualified teachers and outdated curricula that don't prepare students for jobs.",
      long: "Rural areas lack access to quality education due to cost and poor infrastructure while private educational institutions exploit families. Government schools suffer from unqualified teachers, poor facilities, and outdated curricula creating a two-tier system. Higher education is inadequately aligned with global trends, universities lack modern teaching methodologies, and limited R&D investment weakens institutional capacity causing brain drain in critical STEM fields."
    },
    solution: {
      short: [
        "Build model government schools with proper facilities in underserved areas",
        "Require all teachers to re-qualify every 5 years with proper training",
        "Add practical skills to curriculum: coding, agriculture, carpentry, hospitality",
        "Create digital learning platform with e-books and recorded lessons",
        "Regulate private schools with fee transparency and mandatory free seats for poor students",
      ],
      long: {
        phases: [
          {
            phase: "Infrastructure and Access Expansion",
            title: "Government School Network Development",
            items: [
              "School mapping surveys to identify underserved areas using Local Government Operation Act budget authority",
              "Model school construction with safe classrooms, gender-separated toilets, clean water, internet connectivity",
              "Align with School Sector Development Plan (SSDP) equity and access provisions",
              "Priority rural investment through provincial and local government coordination"
            ]
          },
          {
            phase: "Faculty Development and Curriculum Reform",
            title: "Teacher Quality and Skills-Oriented Education",
            items: [
              "5-year teacher requalification cycle through Teacher Service Commission with mandatory training",
              "University partnerships for in-service training delivery and STEM teacher recruitment",
              "Technical and Vocational Education (TVET) expansion at secondary level",
              "Mandatory work-oriented subjects grades 6-10: coding, sustainable agriculture, carpentry, hospitality"
            ]
          },
          {
            phase: "Digital Infrastructure and Quality Assurance",
            title: "Technology Integration and Accountability",
            items: [
              "National Education Digital Platform (NEDP) for e-books, recorded lessons, teaching resources",
              "Independent Education Regulatory Authority (IERA) for annual comprehensive audits",
              "Private school accountability with fee transparency and cross-subsidy enforcement",
              "Higher education curriculum modernization with rapid development and revision mechanisms"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Kenya eliminated school fees in 2003 and doubled primary enrollment to 99%",
        "Finland became world leader in education through focus on teacher training",
        "Brazil increased per-student spending 40% while reducing inequality between regions",
        "Rwanda increased young women's university enrollment by 167%",
      ],
      long: [
        {
          country: "Kenya",
          details: "2003 fee elimination doubled primary enrollment achieving 99% net enrollment by 2016",
          impact: "Targeted support for marginalized communities with comprehensive basic education access improvements"
        },
        {
          country: "Finland",
          details: "Transformed from average to world-leading education through teacher training focus and practical skills emphasis",
          impact: "99% comprehensive school enrollment with consistent high outcomes by eliminating private school advantages"
        },
        {
          country: "Brazil",
          details: "FUNDEB system increased per-student spending 40% while reducing inequality between rich/poor municipalities",
          impact: "Targeted funding formulas created more equitable education system with improved learning outcomes"
        },
        {
          country: "Rwanda",
          details: "Comprehensive basic education implementation with practical skills components",
          impact: "167% increase in young women's university enrollment through systematic education system transformation"
        }
      ]
    },
    implementation: {
      short: [
        "Year 1: Map underserved areas, start teacher requalification, establish regulatory authority",
        "Years 2-3: Build model schools, reform curriculum, enforce private school rules",
        "Years 4-5: Full system operation, measure quality improvements, optimize performance",
      ],
      long: [
        {
          timeline: "Year 1",
          description: "System Mapping and Institutional Setup",
          details: [
            "Comprehensive school mapping to identify underserved areas with provincial coordination",
            "Teacher requalification program launch through Teacher Service Commission",
            "Independent Education Regulatory Authority (IERA) establishment with audit capabilities",
            "National Education Digital Platform development initiation and pilot testing"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "Infrastructure Development and Curriculum Implementation",
          details: [
            "Model school construction with modern facilities and technology integration",
            "Curriculum reform rollout with TVET expansion and work-oriented subjects",
            "Private school regulation enforcement with fee transparency requirements",
            "Digital learning infrastructure deployment with offline-compatible content"
          ]
        },
        {
          timeline: "Years 4-5",
          description: "Full System Operation and Quality Measurement",
          details: [
            "Full education system operation with quality assurance mechanisms",
            "Higher education curriculum modernization with international benchmark alignment",
            "Performance measurement through standardized testing and learning outcome assessment",
            "System optimization based on quality audits and student performance data"
          ]
        }
      ]
    },
    performanceTargets: [
      "95% primary enrollment in underserved areas within 5 years",
      "All teachers certified under new standards by year 5",
      "50% reduction in private school fee complaints",
      "25% improvement in standardized test scores",
    ],
    category: "Education",
    priority: "High",
    timeline: "5 years",
  },
  {
    id: "12",
    title: "Support Local Production and Innovation",
    description:
      "Reduce import dependency by supporting local businesses through public-private investment funds, tax incentives, supply chain help, and university partnerships.",
    problem: {
      short: "Nepal imports too much and produces too little. Local businesses face high costs, bureaucracy, and unreliable energy, while farmers lack legal protection and market access.",
      long: "Nepal remains import-dependent and agriculture-heavy with weak legal protections for farmers and high costs keeping local production uncompetitive. Entrepreneurs face high land prices, bureaucracy, and unreliable energy sources discouraging investment. The manufacturing sector lacks upstream/downstream linkages, while university-industry collaboration is minimal, limiting innovation and technology transfer."
    },
    solution: {
      short: [
        "Create Industrial Growth Fund that invests in local companies with private partners",
        "Give tax breaks to companies that meet local content and employment targets",
        "Help farmers with forward purchase agreements and quality grading centers",
        "Fund university-industry research projects through competitive grants",
        "Ensure transparent, competitive selection for all support programs",
      ],
      long: {
        phases: [
          {
            phase: "Financial Instruments",
            title: "Industrial Growth Fund and Investment Incentives",
            items: [
              "Public-private blended finance vehicle taking maximum 20% equity stakes in commercially vetted local firms",
              "Independent governance with private sector experts, technical specialists, Auditor-General oversight",
              "Market discipline: mandatory 1:1 or 2:1 private co-investment requirement to crowd in capital",
              "Performance-based releases: tranched funding tied to capacity targets, local sourcing quotas, employment milestones"
            ]
          },
          {
            phase: "Supply Chain Development",
            title: "Raw Material and Market Linkages",
            items: [
              "Forward purchase agreements: government/cooperatives guarantee minimum prices for farmers supplying local manufacturers",
              "Input aggregation hubs: public-private processing centers providing reliable supply with quality grading",
              "Preferential government procurement: schools, hospitals, public works buy from certified local producers",
              "Supply chain registration: import VAT exemptions require suppliers to document local sourcing efforts"
            ]
          },
          {
            phase: "Innovation Ecosystem",
            title: "University-Industry Collaboration",
            items: [
              "Competitive University Innovation Fund: Ministry of Education/Investment Board matching grants for applied R&D",
              "Technology Transfer Offices in major universities with IP support and incubation facilities",
              "Tax credits for firms investing in university R&D or purchasing university-developed technology",
              "Impact Fund pooling CSR contributions from BFIs and corporates for university innovation projects"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Malaysia achieved 7.3% annual GDP growth through coordinated public investment",
        "Chile diversified beyond mining through upstream/downstream industrial linkages",
        "OECD analysis shows conditional incentives work better than unconditional ones",
      ],
      long: [
        {
          country: "Malaysia",
          details: "Resource-based industrial development achieved 7.3% annual GDP growth 1961-2023",
          impact: "Manufacturing reached 36.8% of GDP through coordinated public investment, tax incentives, and supply chain development"
        },
        {
          country: "Chile",
          details: "Diversified beyond mining into salmon, fruits, wine, and wood products through upstream/downstream linkages",
          impact: "Supported high-income transition with similar policy combinations of public investment and private sector development"
        },
        {
          country: "OECD Analysis",
          details: "Conditional tax holidays with performance triggers and university-industry linkages significantly outperform unconditional incentives",
          impact: "Developing country contexts show better outcomes with performance-based incentives rather than blanket support"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-6: Set up Industrial Growth Fund and design tax incentive framework",
        "Year 1: Make first investments, pilot raw material programs",
        "Years 2-3: Scale successful models, evaluate performance, optimize systems",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Fund Establishment and Framework Design",
          details: [
            "Industrial Growth Fund establishment with independent governance structure",
            "Tax incentive framework design with performance-linked benefits and clawback mechanisms",
            "University partnership agreements for Technology Transfer Office establishment",
            "Competitive selection criteria development for transparent fund allocation"
          ]
        },
        {
          timeline: "Year 1",
          description: "Initial Implementation and Pilot Programs",
          details: [
            "First IGF investments with private co-investment requirements and performance monitoring",
            "Raw material aggregation pilots with forward purchase agreements for farmers",
            "Technology Transfer Office establishment at major universities with incubation support",
            "Preferential procurement program launch for certified local producers"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "Scaling and System Optimization",
          details: [
            "Scale successful models based on performance evaluation and impact assessment",
            "University Innovation Fund operational with competitive grant allocation",
            "Supply chain integration improvements with quality standards and market linkages",
            "System optimization based on job creation, export generation, and technology transfer metrics"
          ]
        }
      ]
    },
    performanceTargets: [
      "50% increase in local content of manufactured goods within 5 years",
      "200 new manufacturing jobs per 10 crore fund investment",
      "30% increase in university-industry collaborative projects",
      "25% reduction in key raw material import dependency",
    ],
    category: "Economic Development",
    priority: "Medium",
    timeline: "3 years",
  },
  {
    id: "13",
    title: "Reform Student Politics into Civic Education",
    description:
      "Ban political party control of student unions and replace with independent student councils while teaching proper civic education in all schools and universities.",
    problem: {
      short: "Student unions act as branches of political parties, leading to violence, strikes, and property damage. Students graduate without understanding how democracy actually works.",
      long: "Student unions act as extensions of national political parties, leading to intimidation, strikes, property damage, and campus violence. Young people graduate without meaningful civic education despite being Nepal's future leaders. Political party financing and control of student organizations undermines campus autonomy and creates destructive rather than constructive political engagement."
    },
    solution: {
      short: [
        "Ban student unions from being controlled by political parties",
        "Replace party-backed unions with independent elected student councils",
        "Create punishment system: suspension, fines, community service for violence",
        "Integrate student councils with National Youth Council for governance training",
        "Teach comprehensive civic education from secondary through university levels",
      ],
      long: {
        phases: [
          {
            phase: "Campus Autonomy and Depoliticization",
            title: "Remove Party Control from Student Organizations",
            items: [
              "Ban direct party affiliation of student unions through Education Regulations amendment",
              "Prohibit political party symbols, flags, or financing inside campuses under university codes",
              "Autonomous campus governance under independent boards removing Home Ministry political interference",
              "Campus security neutrality from external political pressure with institutional protection"
            ]
          },
          {
            phase: "Independent Student Governance",
            title: "Democratic Student Council System",
            items: [
              "Replace party-backed unions with elected councils recognized under University Acts",
              "Independent candidate elections with mandatory gender and minority representation quotas",
              "Focused mandate: academic affairs, student welfare, scholarships, housing, health services",
              "Structured policy debates replacing destructive strikes and protests"
            ]
          },
          {
            phase: "Civic Education and National Integration",
            title: "Comprehensive Democratic Education",
            items: [
              "Constitutional literacy: basic rights, parliamentary functions, separation of powers",
              "Public finance education: budget processes, taxation, anti-corruption mechanisms",
              "Strengthen National Youth Council for student-to-governance pathways",
              "Debate and deliberation skills through parliamentary-style classroom discussions"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Germany's student government system keeps student unions separate from party politics",
        "Finland's civic education produces citizens with highest political knowledge globally",
        "South Korea channeled student activism into constructive civic engagement after democratization",
      ],
      long: [
        {
          country: "Germany",
          details: "Student government system separates student unions from party politics while maintaining civic engagement",
          impact: "Contributes to high political knowledge and participation rates among graduates without campus violence"
        },
        {
          country: "Finland",
          details: "Civic education integration from secondary through university produces informed democratic citizens",
          impact: "Citizens demonstrate among world's highest levels of political knowledge and democratic participation"
        },
        {
          country: "South Korea",
          details: "Post-democratization student council reforms (1987-1990) channeled activist energy into constructive engagement",
          impact: "Contributed to democratic consolidation while eliminating campus violence and political party control"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-6: Change education regulations, help universities adopt new codes",
        "Year 1: Hold independent student council elections, develop civic curriculum",
        "Years 2-3: Connect student councils to youth governance, establish pathways to public service",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Legal Framework and Institutional Transition",
          details: [
            "Education regulations amendment banning direct party affiliation of student organizations",
            "University code adoption prohibiting political party symbols and financing on campus",
            "Student council transition planning with election preparation and institutional support",
            "Campus autonomy establishment with independent governance boards"
          ]
        },
        {
          timeline: "Year 1",
          description: "Democratic Elections and Curriculum Development",
          details: [
            "Independent student council elections with gender and minority representation requirements",
            "Civic education curriculum development from secondary through university levels",
            "Constitutional literacy programs covering rights, governance structures, democratic processes",
            "Graduated accountability system implementation with community service focus"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "National Integration and Governance Pathways",
          details: [
            "National Youth Council integration for structured democratic participation",
            "Student-to-governance pathways through local government observation and youth budgets",
            "Parliamentary Youth Hearings establishment for policy proposal development",
            "System evaluation and optimization based on campus violence reduction and civic knowledge metrics"
          ]
        }
      ]
    },
    performanceTargets: [
      "80% reduction in campus violence incidents within 2 years",
      "90% of graduates demonstrate basic constitutional knowledge",
      "50 student-led civic projects launched annually",
      "Zero incidents of party-political interference in campus governance",
    ],
    category: "Education Reform",
    priority: "Medium",
    timeline: "3 years",
  },
  {
    id: "14",
    title: "Make Security Services Merit-Based with Health Checks",
    description:
      "Choose security personnel based on capability rather than loyalty, with transparent performance tracking, rotation limits, and mandatory health evaluations.",
    problem: {
      short: "Security personnel are chosen for political loyalty rather than capability. Lack of health checks and long tenures in same positions undermine professionalism and public safety.",
      long: "Security personnel are chosen for loyalty rather than capability, undermining professionalism and operational effectiveness. Political patronage drives appointments while lack of routine health and integrity checks results in officers with substance abuse, untreated stress disorders, or compromised fitness remaining in positions that risk public safety. Long tenures in same locations create corruption opportunities."
    },
    solution: {
      short: [
        "Fill all senior security positions through competitive exams and performance reviews",
        "Publish performance scorecards online with security-sensitive information removed",
        "Limit postings to maximum 3 years in same location",
        "Require annual mental health checks and quarterly drug/alcohol screening",
        "Protect officers who report political interference through legal safeguards",
      ],
      long: {
        phases: [
          {
            phase: "Merit-Based Selection System",
            title: "Professional Appointment and Promotion",
            items: [
              "Merit-based promotions through PSC-administered exams and structured performance reviews for all senior positions",
              "Transparent scorecards published online with security-sensitive data redacted for public accountability",
              "Independent oversight through Public Service Commission examiners and civil-society observers",
              "Diversified expertise recruitment from varied technical backgrounds to cover security challenges"
            ]
          },
          {
            phase: "Health and Integrity Standards",
            title: "Comprehensive Health and Fitness Requirements",
            items: [
              "Routine examinations: annual mental health checks and quarterly drug/alcohol screening for all officers",
              "Physical fitness tests for promotion eligibility with standardized assessment criteria",
              "Psychological evaluation for stress management and decision-making under pressure",
              "Health monitoring integration into annual performance reviews and promotion decisions"
            ]
          },
          {
            phase: "Accountability and Protection",
            title: "Rotation, Oversight, and Whistleblower Protection",
            items: [
              "Rotation and tenure limits: maximum 3 years per post with no repeat posting in same city/province within 5 years",
              "Whistleblower protection with legal safeguards for officers reporting political interference",
              "Civilian oversight through Auditor-General, Human Rights Commission, and Parliamentary committees",
              "Digital HR platform for transparent performance tracking and career management"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Singapore's merit-based public service contributed to world's most efficient bureaucracy",
        "Estonia's digital civil service achieved 99% online service availability",
        "Merit-based systems correlate with reduced corruption and improved public trust",
      ],
      long: [
        {
          country: "Singapore",
          details: "Public Service Commission independence established in 1951 created one of world's most efficient bureaucracies",
          impact: "Competitive scholarship system with service bonds and private-sector competitive salaries contributed to 100x GDP per capita increase 1959-2009"
        },
        {
          country: "Estonia",
          details: "Digital civil service reconstruction after independence achieved comprehensive reform",
          impact: "99% online service availability while eliminating corruption in routine government services through professional management"
        },
        {
          country: "Global Evidence",
          details: "Merit-based appointment systems consistently correlate with reduced corruption and improved public trust",
          impact: "Countries with professional civil services show better governance outcomes and higher citizen satisfaction"
        }
      ]
    },
    implementation: {
      short: [
        "Months 0-12: Change police rules, introduce rotation requirements, start health checks",
        "Years 1-3: Expand Public Service Commission authority, create advisory panels",
        "Years 3-5: Digital HR platform, expand civilian oversight",
      ],
      long: [
        {
          timeline: "Months 0-12",
          description: "Immediate Administrative Reforms",
          details: [
            "Amend Police Rules to require PSC-run exams and transparent performance reviews",
            "Ministry of Home Affairs rotation directive with 3-year maximum tenure implementation",
            "Mandatory annual health and fitness checks with psychological evaluation integration",
            "Performance scorecard publication system with security-appropriate transparency"
          ]
        },
        {
          timeline: "Years 1-3",
          description: "Institutional Capacity Expansion",
          details: [
            "Expand Public Service Commission mandate to cover all senior promotions across security services",
            "Security & Civil Service Promotions Advisory Panel establishment for top leadership vetting",
            "Health and integrity checks integration into annual performance reviews",
            "Whistleblower protection enforcement in Police and Civil Service Acts"
          ]
        },
        {
          timeline: "Years 3-5",
          description: "Digital Integration and Oversight Enhancement",
          details: [
            "Digital HR and health-monitoring platform deployment for comprehensive tracking",
            "Civilian oversight bodies' reporting expansion to include health, fitness, and integrity compliance",
            "Performance measurement system optimization based on public trust and service delivery metrics",
            "Full professional management system operation with continuous improvement"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% senior positions filled through competitive exams by Year 2",
      "95% compliance with annual health evaluations",
      "40% reduction in public complaints against security services",
      "60% improvement in public trust ratings",
    ],
    category: "Security Reform",
    priority: "Medium",
    timeline: "5 years",
  },
  {
    id: "15",
    title: "Attract Quality Foreign Investment with Strong Safeguards",
    description:
      "Create clear investment rules that attract quality foreign investment while protecting national interests through transparent screening and community benefit requirements.",
    problem: {
      short: "Nepal loses good investors due to unclear rules and bureaucracy, while lacking safeguards against exploitative investment that doesn't benefit local communities.",
      long: "Nepal loses high-value investors due to fragmented rules, bureaucratic rigidity, restrictive sectoral limitations, and weak profitability incentives. FITTA ownership restrictions and negative lists block investment while regulatory bodies lack expertise for effective facilitation. Past policies failed to deliver meaningful industrial investment, and smaller high-value investors including diaspora and venture capital face barriers despite Nepal's untapped potential."
    },
    solution: {
      short: [
        "Create single, clear investment manual with all rules and timelines",
        "Set up investment screening unit to evaluate projects for national security and community impact",
        "Require community consent and benefit sharing for resource extraction projects",
        "Mandate technology transfer commitments for strategic sector investments",
        "Focus on attracting technology development and value-added manufacturing",
      ],
      long: {
        phases: [
          {
            phase: "Clear Investment Framework",
            title: "Consolidated Rules and Transparency",
            items: [
              "Consolidated Investment Manual with single public webpage containing FITTA/FITTR/automatic rules, negative list, approval timelines",
              "Department of Industry + Investment Board publication of streamlined procedures with regular updates",
              "Investment Screening & Safeguards Unit (ISSU) embedded within Investment Board with delegated authority",
              "National security screening for land/border sensitivity and systemic environmental/social risks"
            ]
          },
          {
            phase: "Resource Protection and Community Benefits",
            title: "Safeguards and Local Participation",
            items: [
              "Reaffirm Land Act limits: no foreign land ownership, Nepal-registered entity requirement for long-term leases",
              "Strategic resource safeguards: hydropower/mining requires local processing priority",
              "Community consent requirements with public interest screening and Community Benefit Agreements",
              "Revenue-sharing mandates: local government participation in resource extraction benefits"
            ]
          },
          {
            phase: "Technology Transfer and Strategic Partnerships",
            title: "Knowledge and Capacity Building",
            items: [
              "Binding Technology Transfer & Localisation Plans (TTLP) mandatory for strategic sectors",
              "Milestone-based compliance: local assembly percentages, Nepali technician training quotas",
              "Performance-linked incentives: tax breaks tied to technology transfer milestone achievement",
              "Sector priorities: technology development, sustainable agriculture, renewable energy, value-added manufacturing"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "37 countries maintain strong foreign investment while protecting critical sectors",
        "Singapore combines open markets with strategic screening for quality investment",
        "Canada's investment review process shows how transparent conditional approval works",
      ],
      long: [
        {
          country: "Global Best Practice",
          details: "37 countries including Singapore, Canada, Germany maintain robust FDI flows while protecting critical sectors",
          impact: "Demonstrate how transparent, proportionate screening mechanisms can attract quality investment while maintaining economic sovereignty"
        },
        {
          country: "Singapore",
          details: "Investment framework combines open markets with strategic screening for quality investment attraction",
          impact: "Achieved among world's highest per-capita FDI while maintaining economic sovereignty through clear, transparent processes"
        },
        {
          country: "Canada",
          details: "Investment Canada Act demonstrates clear rules and conditional approvals for balancing investment attraction with national interests",
          impact: "Shows how transparent screening processes can attract quality investment while protecting strategic national interests"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-3: Set up screening unit and publish investment manual",
        "Months 4-6: Create community benefit templates and technology transfer frameworks",
        "Year 1: Full screening system operation with first conditional approvals",
      ],
      long: [
        {
          timeline: "Months 1-3",
          description: "System Establishment and Manual Publication",
          details: [
            "Investment Screening & Safeguards Unit (ISSU) establishment within Investment Board",
            "Consolidated Investment Manual publication with comprehensive rule compilation",
            "Screening procedures development for standardized project vetting",
            "Investor due diligence framework for ownership verification and performance assessment"
          ]
        },
        {
          timeline: "Months 4-6",
          description: "Framework Development and Template Creation",
          details: [
            "Community benefit agreement templates development for resource extraction projects",
            "Technology transfer milestone frameworks for strategic sector investments",
            "Conditional approval authority establishment with binding commitments",
            "Performance-linked incentive structure design with clawback mechanisms"
          ]
        },
        {
          timeline: "Year 1",
          description: "Full System Operation and Initial Approvals",
          details: [
            "Full screening system operation with transparent project evaluation",
            "First conditional approvals with binding technology transfer and community benefit commitments",
            "Performance monitoring system for investment milestone compliance",
            "System optimization based on early results and stakeholder feedback"
          ]
        }
      ]
    },
    performanceTargets: [
      "50% increase in quality foreign investment within 3 years",
      "100% of strategic investments include technology transfer commitments",
      "75% improvement in investment approval timeline transparency",
      "Zero exploitative resource extraction without community benefits",
    ],
    category: "Investment Policy",
    priority: "Medium",
    timeline: "3 years",
  },
  {
    id: "16",
    title: "Make Proportional Representation More Democratic",
    description:
      "Reform PR candidate selection through open party primaries and regional constituencies while maintaining constitutional inclusion requirements for marginalized communities.",
    problem: {
      short: "Party leaders choose PR representatives without voter input, weakening democratic accountability while still needing to ensure inclusion for marginalized communities.",
      long: "Party leaders appoint PR representatives without voter input, weakening democratic accountability while maintaining necessary inclusion for marginalized communities. Article 84 mandates mixed electoral system with 110 PR seats ensuring representation for women, Dalits, indigenous communities, Madhesis, Tharus, Muslims, and backward regions. Complete abolition requires impossible 2/3 constitutional amendment, so reform must democratize selection while preserving inclusion."
    },
    solution: {
      short: [
        "Require parties to hold open primaries where members vote for PR candidates",
        "Create regional PR constituencies instead of single national list",
        "Add accountability measures with public reporting and recall provisions",
        "Keep constitutional quotas for marginalized communities as required",
        "Strengthen community input in PR candidate selection processes",
      ],
      long: {
        phases: [
          {
            phase: "Democratic PR Nominations",
            title: "Open Primary System",
            items: [
              "Mandatory open party primaries for PR nominations with registered member voting",
              "Public disclosure of selection criteria, candidate qualifications, and voting processes",
              "Competitive selection within inclusion categories maintaining constitutional quotas while improving quality",
              "Performance-based party member evaluation of PR representatives with accountability measures"
            ]
          },
          {
            phase: "Enhanced Accountability Mechanisms",
            title: "Regional Representation and Oversight",
            items: [
              "Regional PR constituencies instead of single national list with provincial/regional representation",
              "Public reporting requirements: monthly constituency reports for all MPs regardless of election method",
              "Recall provisions applicable to both FPTP and PR representatives for misconduct",
              "Parliamentary performance scorecards published quarterly for all members with transparent metrics"
            ]
          },
          {
            phase: "Constitutional Inclusion Maintenance",
            title: "Preserve Marginalized Community Representation",
            items: [
              "Maintain mandatory quotas for marginalized communities as constitutionally required",
              "Strengthen community input in PR candidate selection processes with local consultation",
              "Ensure diverse representation while improving democratic legitimacy of selection",
              "Open-list PR system introduction for enhanced voter choice within constitutional framework"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Germany's system combines local accountability with proportional inclusion",
        "New Zealand reformed party list processes to increase democratic input",
        "Scotland's system maintains accountability while ensuring diverse representation",
      ],
      long: [
        {
          country: "Germany",
          details: "Mixed-member system combines constituency accountability with proportional inclusion",
          impact: "Achieves both democratic legitimacy and diverse representation through balanced electoral framework"
        },
        {
          country: "New Zealand",
          details: "MMP system reformed party list processes to increase democratic input while maintaining proportional outcomes",
          impact: "Demonstrates how regional PR seats can maintain accountability while ensuring inclusion of diverse communities"
        },
        {
          country: "Scotland",
          details: "Additional member system maintains accountability while ensuring inclusion through regional representation",
          impact: "Shows how democratizing PR selection processes preserves constitutional inclusion while improving legitimacy"
        }
      ]
    },
    implementation: {
      short: [
        "Constitutional amendment required for major changes",
        "Immediate reforms through Election Commission regulations",
        "Strengthen election commission authority for accountability enforcement",
        "Build political consensus for deeper constitutional reforms",
      ],
      long: [
        {
          timeline: "Months 1-12",
          description: "Immediate Regulatory Reforms",
          details: [
            "Election Commission regulations for mandatory open party primaries implementation",
            "Regional PR constituency establishment through administrative restructuring",
            "Public reporting requirements for all PR representatives with accountability measures",
            "Performance scorecard system development for parliamentary oversight"
          ]
        },
        {
          timeline: "Years 1-2",
          description: "Implementation and Monitoring",
          details: [
            "Open party primary system operational with registered member voting",
            "Regional representation system functioning with constituency accountability",
            "Enhanced accountability mechanisms enforcement through Election Commission authority",
            "Community input strengthening in candidate selection with local consultation"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "Constitutional Reform Consensus Building",
          details: [
            "Political consensus building for deeper constitutional reforms where needed",
            "System evaluation and optimization based on democratic participation and inclusion outcomes",
            "Constitutional amendment preparation for permanent protection of democratic reforms",
            "Maintained constitutional inclusion requirements with improved selection legitimacy"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% PR nominations through open party primaries",
      "Regional representation for all PR constituencies",
      "Enhanced accountability mechanisms for all MPs",
      "Maintained constitutional inclusion requirements",
    ],
    category: "Electoral Reform",
    priority: "Medium",
    timeline: "3 years",
  },
  {
    id: "17",
    title: "End Permanent Government Jobs Without Performance",
    description:
      "Create accountability systems for government employees through performance management, citizen complaints, and consequences for poor service while maintaining fair process.",
    problem: {
      short: "Government employees work without fear of consequences, leading to poor service and corruption. Citizens suffer while officials remain comfortable regardless of performance.",
      long: "Government employees operate without fear of consequences, leading to complacency, poor service, and misuse of power. Current job security regardless of performance creates a culture where citizens suffer while officials remain comfortable. The system lacks accountability mechanisms, performance standards, and consequences for negligence while providing permanent employment without service delivery requirements."
    },
    solution: {
      short: [
        "Create national citizen complaint portal with case tracking and resolution timelines",
        "Set quarterly performance targets for all frontline government workers",
        "Modernize recruitment to test practical skills, not just multiple choice questions",
        "Allow citizens to sue government officials personally for negligence through fast courts",
        "Protect against false complaints with strong due process and legal representation",
      ],
      long: {
        phases: [
          {
            phase: "Immediate Administrative Actions",
            title: "Performance Management and Complaint Systems",
            items: [
              "National Citizen Complaint Portal with verified complaints, case tracking, automatic escalation",
              "Mandatory performance management with quarterly KPIs for all frontline roles",
              "Modernized recruitment through digital processes emphasizing practical skills over MCQs",
              "Whistleblower protection enhancement with published legal protections and investigation timelines"
            ]
          },
          {
            phase: "Accountability Mechanisms with Due Process",
            title: "Civil Liability and Disciplinary Framework",
            items: [
              "Civil liability framework allowing personal lawsuits for negligence through fast-track small claims courts",
              "Three-strikes disciplinary system: two criminal convictions = removal; three misconduct convictions = lifetime ban",
              "Administrative fines through Civil Service Departmental Tribunal with judicial confirmation",
              "Criminal liability enforcement: strengthen CIAA/AG prosecution for corruption and embezzlement"
            ]
          },
          {
            phase: "Strong Protections Against Abuse",
            title: "Due Process and Anti-Retaliation Safeguards",
            items: [
              "Presumption of innocence in all disciplinary proceedings with notice and legal representation",
              "Political motivation screening to prevent complaint misuse and malicious prosecution",
              "Limited summary dismissals only for serious offenses with strong evidence and expedited procedures",
              "Privacy protection for salary deductions with subsistence guarantees and family protection"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "New Zealand's civil service transformation improved efficiency while maintaining due process",
        "Singapore's performance-based system ranks among world's most efficient governments",
        "Georgia's reforms increased public satisfaction from 5% to over 70% after 2003",
      ],
      long: [
        {
          country: "New Zealand",
          details: "1980s civil service transformation ended jobs-for-life while implementing rigorous due process",
          impact: "Dramatically improved government efficiency and citizen satisfaction through professional management with legal protections"
        },
        {
          country: "Singapore",
          details: "Performance-based system with competitive compensation and strict accountability",
          impact: "Consistently ranks among world's most efficient governments with high citizen satisfaction and professional service delivery"
        },
        {
          country: "Georgia",
          details: "Post-2003 reforms combined merit-based hiring with accountability measures and due process protection",
          impact: "Increased public satisfaction with government services from 5% to over 70% within five years"
        }
      ]
    },
    implementation: {
      short: [
        "Months 1-3: Launch complaint portal, start performance reviews, test digital skills",
        "Months 4-6: Complete legal framework, set up fast-track courts",
        "Year 1: Full accountability system operation with performance-based actions",
      ],
      long: [
        {
          timeline: "Months 1-3",
          description: "Immediate System Launch",
          details: [
            "National Citizen Complaint Portal launch with verified complaint tracking and resolution monitoring",
            "Performance appraisal rollout with quarterly KPIs for frontline government roles",
            "Digital literacy testing within 6 months for new hires, 12 months for existing staff",
            "Public performance scorecards for all agencies and departments with citizen satisfaction metrics"
          ]
        },
        {
          timeline: "Months 4-6",
          description: "Legal Framework and Court System",
          details: [
            "Legal framework completion for civil liability and fast-track court procedures",
            "Whistleblower system launch with anonymous complaint options and case tracking",
            "Civil Service Departmental Tribunal enhancement for administrative fines with judicial oversight",
            "Due process requirements establishment: notice, opportunity to be heard, legal representation, appeals process"
          ]
        },
        {
          timeline: "Year 1",
          description: "Full System Operation and Performance-Based Actions",
          details: [
            "Full accountability system operation with performance-based actions and measurable outcomes",
            "First performance-based disciplinary actions with strong due process protection",
            "System evaluation and optimization based on citizen satisfaction and service delivery metrics",
            "Digital literacy standards achievement for 95% of government employees"
          ]
        }
      ]
    },
    performanceTargets: [
      "80% improvement in citizen satisfaction with government services within 3 years",
      "90% of service requests completed within published timelines",
      "50% reduction in corruption complaints",
      "95% of government employees meet digital literacy standards",
    ],
    category: "Civil Service Reform",
    priority: "High",
    timeline: "3 years",
  },
  {
    id: "18",
    title: "End Political Appointments in Government",
    description:
      "Fill all senior government positions through competitive examinations and experience requirements instead of political loyalty and party connections.",
    problem: {
      short: "All top government jobs go to political loyalists rather than qualified people, creating incompetent administration that serves party interests instead of citizens.",
      long: "All top government positions - CDOs, Secretaries, Agency Heads - are filled through political loyalty rather than merit, creating incompetent administration that serves party interests instead of citizens. The Civil Service Act 2049 already requires merit-based recruitment, and the Constitution mandates competent administration, but current laws are not enforced, allowing political appointments to undermine professional governance."
    },
    solution: {
      short: [
        "Require competitive written and practical exams for all senior positions",
        "Demand minimum 8 years relevant experience with proven performance record",
        "Use independent selection panels with technical experts, no active politicians",
        "Publish candidate qualifications and selection reasons publicly",
        "Give officials fixed tenure protection so they can't be fired arbitrarily",
      ],
      long: {
        phases: [
          {
            phase: "Immediate Merit-Based Selection",
            title: "Examination and Experience Requirements",
            items: [
              "Examination-based selection for all senior positions (CDO, Secretary, Director General) through rigorous competitive exams",
              "Experience requirements: minimum 8 years relevant experience with proven performance record",
              "Lateral entry from qualified professionals outside civil service within 6-12 months for expertise",
              "Independent selection panels with technical experts, retired civil servants, public representatives - no active politicians"
            ]
          },
          {
            phase: "Transparency and Protection",
            title: "Public Accountability and Tenure Security",
            items: [
              "Public scorecards with candidate qualifications, examination scores, selection rationale published",
              "Performance contracts with clear KPIs and annual public evaluation of results",
              "Fixed tenure protection: cannot be transferred or removed arbitrarily except for documented performance failure",
              "Staff allocation to specific levels (federal, provincial, local) with accountability to that level"
            ]
          },
          {
            phase: "Civil Service Restructuring",
            title: "Comprehensive System Reform",
            items: [
              "Civil Service Act 2049 amendment to remove political party-based trade unions",
              "Reallocation of staff from overstaffed federal ministries to under-resourced provincial/local governments",
              "Ministry restructuring as recommended by Public Expenditure Review Commission Report 2075",
              "Employment on 5-year renewable contracts based strictly on performance"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Singapore's merit-based civil service contributed to 100x GDP growth from 1959-2009",
        "South Korea's 1980s reforms eliminated political appointments, enabling economic miracle",
        "Botswana's merit-based appointments created Africa's most effective government",
      ],
      long: [
        {
          country: "Singapore",
          details: "Merit-based civil service contributed to 100x GDP growth from 1959-2009 through professional administration",
          impact: "Public Service Commission independence created world-class bureaucracy serving citizens rather than politicians"
        },
        {
          country: "South Korea",
          details: "1980s civil service reforms eliminated political appointments during democratization period",
          impact: "Contributed to economic miracle and democratic consolidation through consistent policy implementation across political changes"
        },
        {
          country: "Botswana",
          details: "Maintained merit-based appointments since independence creating Africa's most effective government",
          impact: "Consistent economic growth and low corruption through professional bureaucracy serving public interest"
        }
      ]
    },
    implementation: {
      short: [
        "Immediate order ending political appointments within 30 days",
        "Public Service Commission enforces merit requirements",
        "Evaluation period for current appointees with competency tests",
        "Change Civil Service Act to remove party-based trade unions",
      ],
      long: [
        {
          timeline: "Days 1-30",
          description: "Immediate Administrative Order",
          details: [
            "Prime Minister directive ending all political appointments within 30 days",
            "Public Service Commission authority enforcement for merit requirements using existing constitutional powers",
            "Emergency transition protocol for continuity of essential government services",
            "Legal framework preparation for Civil Service Act amendments"
          ]
        },
        {
          timeline: "Months 1-6",
          description: "Transition and Competency Evaluation",
          details: [
            "Current appointees face competency evaluation through standardized testing and performance review",
            "Replacement process for those failing evaluation within 6 months",
            "Independent selection panel establishment for all future senior appointments",
            "Public scorecard system implementation for transparent candidate evaluation"
          ]
        },
        {
          timeline: "Months 6-12",
          description: "System Institutionalization",
          details: [
            "Civil Service Act amendment to remove political party-based trade unions and institutionalize merit",
            "Staff reallocation from federal to provincial/local governments based on capacity needs",
            "Performance contract system operational for all senior officials with public evaluation",
            "Fixed tenure protection implementation preventing arbitrary removal"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% senior appointments through competitive examination within 1 year",
      "50% improvement in government service delivery within 2 years",
      "90% reduction in political interference complaints within 3 years",
      "Complete elimination of party-based appointments",
    ],
    category: "Civil Service Reform",
    priority: "High",
    timeline: "1 year",
  },
  {
    id: "19",
    title: "Make Courts Truly Independent",
    description:
      "Ensure judicial independence through merit-based judge appointments, transparent accountability, and constitutional protections from political interference.",
    problem: {
      short: "Judges appointed through political connections compromise court independence. Lack of transparency in judicial conduct undermines rule of law and public trust.",
      long: "Judges appointed through political connections compromise court independence while lack of transparency in judicial conduct and appointments undermines rule of law and public trust. Article 126 guarantees judicial independence and Articles 128-138 establish Supreme Court authority, but implementation mechanisms are weak. Current appointment processes lack merit-based selection and public accountability."
    },
    solution: {
      short: [
        "Create independent commission with retired judges and legal scholars to select new judges",
        "Select judges through written exams, case analysis, and public interviews",
        "Require annual asset declarations and performance transparency for all judges",
        "Give judges fixed tenure security and financial independence from executive control",
        "Create enforcement mechanisms to ensure court orders are actually implemented",
      ],
      long: {
        phases: [
          {
            phase: "Independent Appointment Process",
            title: "Merit-Based Judicial Selection",
            items: [
              "Independent Judicial Appointment Commission (IJAC) with senior retired judges, non-partisan legal scholars, civil society representatives",
              "Merit-based selection through written examination, case analysis, public interview process for all appointments",
              "No political ties: lifetime prohibition on judges holding party membership or engaging in political activism",
              "Conflict of interest prohibitions: no financial, business, or political interests affecting judicial duties"
            ]
          },
          {
            phase: "Judicial Accountability Framework",
            title: "Transparency and Performance Standards",
            items: [
              "Annual asset declarations: all judges publish audited wealth statements with source documentation",
              "Performance transparency: case resolution times, judgment quality, conduct published annually",
              "Misconduct investigation: independent tribunal with power to recommend removal for proven misconduct",
              "Public complaint system: citizens report judicial misconduct with mandatory investigation timeline"
            ]
          },
          {
            phase: "Constitutional Protections",
            title: "Independence and Enforcement Mechanisms",
            items: [
              "Fixed tenure security: judges cannot be removed except through impeachment-level process",
              "Financial independence: judicial budget allocated directly by Parliament, not executive control",
              "Administrative autonomy: courts manage own administration without executive interference",
              "Decision enforcement mechanisms: judicial police/institution for court order compliance"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Chile's 1990s judicial reforms enabled prosecution of military officials and politicians",
        "South Africa's independent judiciary prosecuted corruption across all political parties",
        "Botswana's independent judiciary consistently ranks among world's most trusted",
      ],
      long: [
        {
          country: "Chile",
          details: "1990s judicial reforms created independent courts that prosecuted military officials and politicians",
          impact: "Established rule of law after dictatorship through merit-based appointments and institutional independence"
        },
        {
          country: "South Africa",
          details: "Post-apartheid judicial independence enabled prosecution of corruption across all political parties",
          impact: "Maintained democratic accountability through independent courts with constitutional protection"
        },
        {
          country: "Botswana",
          details: "Independent judiciary since 1966 consistently ranks among world's most trusted institutions",
          impact: "Contributed to stable democracy and economic development through consistent rule of law"
        }
      ]
    },
    implementation: {
      short: [
        "Set up Independent Judicial Appointment Commission within 6 months",
        "Gradual transition with new process for future vacancies",
        "Public education campaigns on importance of judicial independence",
        "Constitutional reforms to strengthen judicial council structure",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "IJAC Establishment and Legal Framework",
          details: [
            "Independent Judicial Appointment Commission establishment through Parliamentary legislation",
            "Constitutional reforms to current Judicial Council and Constitutional Council structure",
            "Merit-based selection criteria establishment with written exams and public interviews",
            "Asset declaration and performance transparency framework development"
          ]
        },
        {
          timeline: "Months 6-18",
          description: "Gradual Transition and Implementation",
          details: [
            "New appointment process implementation for all future judicial vacancies",
            "Existing judge conduct evaluation for misconduct investigation system",
            "Public education campaigns on judicial independence importance and citizen rights",
            "Financial independence establishment with direct Parliamentary budget allocation"
          ]
        },
        {
          timeline: "Years 2-5",
          description: "Full System Operation and Constitutional Protection",
          details: [
            "Complete merit-based appointment system operation with public accountability",
            "Constitutional protections strengthened through amendment process where necessary",
            "Decision enforcement mechanisms operational for court order compliance",
            "Public confidence measurement and system optimization based on performance metrics"
          ]
        }
      ]
    },
    performanceTargets: [
      "90% public confidence in judicial independence within 5 years",
      "100% asset declaration compliance by all judges",
      "50% reduction in case processing times",
      "Zero tolerance for political interference in judicial appointments",
    ],
    category: "Judicial Reform",
    priority: "High",
    timeline: "5 years",
  },
  {
    id: "20",
    title: "Track All Government Spending in Real-Time",
    description:
      "Create digital system where every government transaction is published online within 24 hours so citizens can see how their tax money is spent.",
    problem: {
      short: "Citizens have no idea how their tax money is spent. Government financial transactions happen in secret, enabling massive corruption and waste of public resources.",
      long: "Citizens have no access to information about government spending while financial transactions happen in darkness, enabling massive corruption and waste. The Right to Information Act 2007 requires proactive financial disclosure and the Auditor General Act establishes audit authority, but real-time tracking systems are absent. Citizens cannot monitor spending in their areas, preventing accountability and oversight."
    },
    solution: {
      short: [
        "Publish every government transaction online within 24 hours with complete details",
        "Show amount, purpose, beneficiary, and approval authority for all spending",
        "Require all senior officials to publish annual asset declarations online",
        "Provide mobile-friendly interface with SMS alerts for major spending in citizen's area",
        "Cross-check all declarations against tax records and bank data automatically",
      ],
      long: {
        phases: [
          {
            phase: "Real-Time Digital Ledger System",
            title: "Complete Transaction Transparency",
            items: [
              "Every transaction online within 24 hours: all government spending from central allocation to final payment",
              "Complete transaction details: amount, purpose, beneficiary, approval authority, procurement process",
              "Searchable public database: citizens track specific projects, contractors, spending categories",
              "Mobile-friendly interface with SMS alerts for major expenditures in citizen's constituency"
            ]
          },
          {
            phase: "Comprehensive Reporting Structure",
            title: "Systematic Financial Accountability",
            items: [
              "Monthly verified statements: all ministries and local governments publish audited financial reports",
              "Quarterly independent audits: external auditors examine spending patterns and compliance",
              "Semi-annual performance reviews: public assessment of budget execution and outcomes",
              "Annual comprehensive reports: Auditor General's detailed analysis accessible to all citizens"
            ]
          },
          {
            phase: "Mandatory Asset Declarations",
            title: "Official Wealth Monitoring",
            items: [
              "All senior officials: ministers, judges, secretaries, commissioners file annual audited wealth statements",
              "Public accessibility: asset declarations published on central transparency portal within 30 days",
              "Change tracking: automatic red-flag system for unexplained wealth increases above salary",
              "Family member inclusion: spouse and dependent children assets included in declarations"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Estonia publishes all transactions in real-time, achieving 95% citizen trust in government",
        "Brazil's transparency portal enabled citizen oversight that discovered major corruption",
        "South Korea's digital budget tracking exposed corruption and improved democratic accountability",
      ],
      long: [
        {
          country: "Estonia",
          details: "Digital government publishes all transactions in real-time achieving comprehensive transparency",
          impact: "95% citizen trust in government financial management while virtually eliminating corruption in routine transactions"
        },
        {
          country: "Brazil",
          details: "Transparency Portal allows citizens to track every government expenditure with detailed search capabilities",
          impact: "Led to discovery of major corruption schemes and 40% reduction in waste through citizen oversight"
        },
        {
          country: "South Korea",
          details: "Digital budget tracking enabled citizen oversight that exposed massive corruption cases",
          impact: "Contributed to democratic accountability and economic development through transparent financial management"
        }
      ]
    },
    implementation: {
      short: [
        "Launch digital platform integrating existing systems within 12 months",
        "Train all financial officers on transparent reporting requirements",
        "Build audit capacity in Auditor General and provincial offices",
        "Change laws to mandate real-time disclosure of all transactions",
      ],
      long: [
        {
          timeline: "Months 1-12",
          description: "Digital Platform Development and Integration",
          details: [
            "Digital platform launch integrating existing government financial systems",
            "Real-time transaction publishing system with 24-hour disclosure requirement",
            "Mobile-friendly interface development with citizen search and alert capabilities",
            "Legal amendments to mandate real-time disclosure under Right to Information Act"
          ]
        },
        {
          timeline: "Months 6-18",
          description: "Capacity Building and Training",
          details: [
            "Training program for all financial officers on transparent reporting requirements",
            "Audit capacity building for Auditor General and provincial audit offices",
            "Asset declaration system integration with automatic verification capabilities",
            "Public education campaigns on financial transparency and citizen monitoring rights"
          ]
        },
        {
          timeline: "Months 12-24",
          description: "Full System Operation and Optimization",
          details: [
            "Complete government financial transparency with all transactions online",
            "Comprehensive reporting structure operational with regular audit cycles",
            "Asset declaration monitoring with automatic red-flag investigation triggers",
            "Performance measurement and system optimization based on citizen engagement and corruption reduction"
          ]
        }
      ]
    },
    performanceTargets: [
      "100% government transactions online within 18 months",
      "90% citizen awareness of spending in their area within 2 years",
      "50% reduction in financial irregularities through transparency pressure",
      "Real-time public access to all non-sensitive financial data",
    ],
    category: "Financial Transparency",
    priority: "High",
    timeline: "18 months",
  },
  {
    id: "21",
    title: "Make All Government Decisions Transparent",
    description:
      "Broadcast all official meetings live, publish decision summaries within 48 hours, and guarantee citizen access to government information within 15 days.",
    problem: {
      short: "Government decisions are made behind closed doors without public input. Citizens have no idea what their representatives discuss or decide on their behalf.",
      long: "Government decisions made behind closed doors without public input or oversight while citizens have no access to information about what their representatives discuss or decide. Article 27 guarantees Right to Information and the Constitution mandates transparency, but implementation lacks live broadcasting, public participation mechanisms, and timely information access."
    },
    solution: {
      short: [
        "Broadcast all official meetings live except for national security matters",
        "Publish bullet-point summaries of key discussions and decisions within 48 hours",
        "Guarantee all citizen information requests answered within 15 working days",
        "Require 30-day public comment periods for all major policy changes",
        "Provide information in Nepali, English, and major local languages",
      ],
      long: {
        phases: [
          {
            phase: "Live Democratic Process",
            title: "Real-Time Government Transparency",
            items: [
              "Broadcast all official meetings: Cabinet, Parliament, provincial assemblies, municipal councils live-streamed",
              "48-hour decision summaries: bullet-point summaries of key discussions and decisions published",
              "Digital Transparency Portal: permanent public access to all meeting records, voting patterns, decision rationales",
              "Real-time updates: social media and SMS notifications for major decisions affecting citizens"
            ]
          },
          {
            phase: "Enhanced Information Access",
            title: "Guaranteed Citizen Information Rights",
            items: [
              "15-day information guarantee: all citizens receive requested government information within 15 working days",
              "Written denial justification: any information denial includes detailed legal reasoning subject to review",
              "Proactive disclosure requirements: budgets, contracts, appointments, policies published automatically",
              "Multiple language access: Nepali, English, and major local languages for key documents"
            ]
          },
          {
            phase: "Public Participation Mechanisms",
            title: "Citizen Engagement and Oversight",
            items: [
              "Citizen input periods: 30-day public comment requirement for major policy changes",
              "Town hall requirements: monthly public meetings in every constituency for direct engagement",
              "Online feedback systems: digital platforms for continuous citizen input on government performance",
              "Regular satisfaction surveys: quarterly public polling on government transparency and responsiveness"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Finland's open government achieves world's highest government trust ratings",
        "Estonia's digital transparency contributes to 85% citizen satisfaction with government",
        "Uruguay's mandatory meeting broadcasts significantly reduced corruption",
      ],
      long: [
        {
          country: "Finland",
          details: "Open government initiative publishes all non-classified information online with comprehensive access",
          impact: "Achieves world's highest government trust ratings and citizen satisfaction through complete transparency"
        },
        {
          country: "Estonia",
          details: "Digital transparency platform allows citizens to access all government processes in real-time",
          impact: "Contributes to 85% citizen satisfaction with government services through comprehensive digital access"
        },
        {
          country: "Uruguay",
          details: "Mandatory meeting broadcasts and decision transparency implemented across government levels",
          impact: "Led to significant reduction in corruption and increased democratic participation through open governance"
        }
      ]
    },
    implementation: {
      short: [
        "Upgrade broadcasting infrastructure for live streaming within 6 months",
        "Develop digital platform integrating existing systems",
        "Train all officials on transparency requirements and citizen engagement",
        "Change Right to Information Act to strengthen disclosure requirements",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Infrastructure and Broadcasting Setup",
          details: [
            "Broadcasting infrastructure upgrade for live streaming within 6 months",
            "Digital platform development integrating existing systems into comprehensive transparency portal",
            "Legal reforms to Right to Information Act and Good Governance Act with stronger disclosure requirements",
            "Multi-language accessibility framework development for inclusive information access"
          ]
        },
        {
          timeline: "Months 6-12",
          description: "System Integration and Training",
          details: [
            "Training programs for all officials on transparency requirements and citizen engagement",
            "Public participation mechanisms implementation with 30-day comment periods",
            "Town hall meeting system establishment in every constituency",
            "Online feedback systems deployment for continuous citizen input"
          ]
        },
        {
          timeline: "Months 12-18",
          description: "Full Transparency Implementation",
          details: [
            "80% of official meetings broadcast live with 48-hour decision summary publication",
            "15-day information guarantee operational with written denial justification system",
            "Complete elimination of closed-door decision making except for national security",
            "Regular satisfaction surveys and performance optimization based on citizen engagement metrics"
          ]
        }
      ]
    },
    performanceTargets: [
      "80% of official meetings broadcast live within 1 year",
      "95% of information requests fulfilled within 15 days",
      "60% increase in citizen engagement with government processes",
      "Complete elimination of closed-door decision making",
    ],
    category: "Transparency",
    priority: "High",
    timeline: "1 year",
  },
  {
    id: "22",
    title: "Add 'None of the Above' Option in All Elections",
    description:
      "Allow voters to reject all candidates by choosing 'None of the Above' - if NOTA wins, hold fresh elections with entirely new candidates.",
    problem: {
      short: "Citizens are forced to choose between inadequate candidates with no way to reject all options, reducing democratic legitimacy and voter satisfaction.",
      long: "Citizens forced to choose between inadequate candidates have no way to reject all options, reducing democratic legitimacy and voter satisfaction. Article 17 protects freedom of expression including the right to reject, and the Supreme Court has mandated Nepal Government and Election Commission to guarantee None of the Above in ballot papers, but implementation is pending."
    },
    solution: {
      short: [
        "Add NOTA option on all ballots for every election and position",
        "Hold fresh election with new candidates if NOTA wins plurality",
        "Ban all original candidates from running in the re-election",
        "Count and publish NOTA votes just like any other candidate",
        "Educate voters about NOTA option and its democratic purpose",
      ],
      long: {
        phases: [
          {
            phase: "NOTA Implementation",
            title: "Universal NOTA Option Deployment",
            items: [
              "NOTA on all ballots for every election and position at all levels of government",
              "Mandatory re-election trigger if NOTA wins plurality with clear procedural framework",
              "Candidate disqualification: all original candidates banned from re-election forcing better selections",
              "Transparent counting with NOTA votes published and reported like any other candidate"
            ]
          },
          {
            phase: "Voter Education and Awareness",
            title: "Democratic Choice Enhancement",
            items: [
              "Voter education campaigns explaining NOTA option and its democratic purpose",
              "Public awareness programs on NOTA significance for democratic accountability",
              "Training for election officials on proper counting and reporting of NOTA votes",
              "Legal framework for re-election procedures when NOTA wins with timeline specifications"
            ]
          },
          {
            phase: "System Integration",
            title: "Electoral Process Enhancement",
            items: [
              "Election Commission regulation for ballot design including NOTA within 3 months",
              "Integration with existing electoral systems and processes without disruption",
              "Monitoring and evaluation system for NOTA impact on candidate quality",
              "Continuous improvement based on democratic legitimacy and voter satisfaction metrics"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "India's NOTA option since 2013 gives voters meaningful choice and improves candidate quality",
        "Nevada (USA) has used NOTA since 1975, forcing parties to reconsider candidate selection",
        "Colombia's blank vote option empowers citizens to express dissatisfaction democratically",
      ],
      long: [
        {
          country: "India",
          details: "NOTA option introduced in 2013 provides voters democratic choice to reject inadequate candidates",
          impact: "Improving candidate quality in subsequent elections as parties respond to NOTA pressure and voter dissatisfaction"
        },
        {
          country: "Nevada, USA",
          details: "NOTA used since 1975 giving voters meaningful choice and democratic expression of dissatisfaction",
          impact: "Occasionally forcing political parties to reconsider candidate selection when NOTA performs well"
        },
        {
          country: "Colombia",
          details: "Blank vote option serves similar function empowering citizens to express dissatisfaction with options",
          impact: "Maintains democratic participation while allowing rejection of inadequate political choices"
        }
      ]
    },
    implementation: {
      short: [
        "Election Commission issues ballot design requirements including NOTA within 3 months",
        "Launch voter education campaign on NOTA option and its significance",
        "Train election officials on proper counting and reporting of NOTA votes",
        "Create legal framework for re-election procedures when NOTA wins",
      ],
      long: [
        {
          timeline: "Months 1-3",
          description: "Regulatory Framework and Ballot Design",
          details: [
            "Election Commission regulation issuance for ballot design requirements including NOTA",
            "Legal framework development for re-election procedures when NOTA wins plurality",
            "Training material development for election officials on NOTA counting and reporting",
            "Integration planning with existing electoral systems and processes"
          ]
        },
        {
          timeline: "Months 3-6",
          description: "Implementation and Education",
          details: [
            "Voter education campaign launch on NOTA option and democratic significance",
            "Training program implementation for election officials on proper procedures",
            "Public awareness activities explaining NOTA purpose and democratic benefits",
            "System testing and preparation for first elections with NOTA option"
          ]
        },
        {
          timeline: "Months 6-12",
          description: "Full Implementation and Monitoring",
          details: [
            "NOTA option available in all elections within 6 months of system deployment",
            "Monitoring and evaluation system for measuring NOTA impact on candidate quality",
            "90% voter awareness achievement through comprehensive education campaigns",
            "Democratic legitimacy enhancement measurement through meaningful voter choice"
          ]
        }
      ]
    },
    performanceTargets: [
      "NOTA option available in all elections within 6 months",
      "90% voter awareness of NOTA option within 1 year",
      "Measurable improvement in candidate quality as parties respond to NOTA pressure",
      "Enhanced democratic legitimacy through meaningful voter choice",
    ],
    category: "Electoral Reform",
    priority: "Medium",
    timeline: "6 months",
  },
  {
    id: "23",
    title: "Limit Prime Ministers to Two Terms Maximum",
    description:
      "Amend constitution to prevent any individual from serving as Prime Minister for more than two terms (10 years total) to ensure leadership renewal.",
    problem: {
      short: "Concentration of power in a single leader for extended periods undermines democratic renewal and creates opportunities for corruption and institutional capture.",
      long: "Concentration of power in a single leader for extended periods undermines democratic renewal and creates opportunities for institutional capture and corruption. Article 76 governs Prime Minister appointment but lacks term limits, allowing indefinite tenure that can lead to authoritarian tendencies and prevent healthy democratic rotation of leadership."
    },
    solution: {
      short: [
        "Set maximum of two terms with no individual serving more than 10 years total",
        "Count non-consecutive terms toward the limit",
        "Serving more than half a parliamentary term counts as full term",
        "Apply term limits from amendment enactment, not retroactively",
        "Follow constitutional amendment process requiring 2/3 Parliamentary majority",
      ],
      long: {
        phases: [
          {
            phase: "Constitutional Amendment Framework",
            title: "Term Limit Structure and Application",
            items: [
              "Two-term maximum with no individual serving more than 10 years total as Prime Minister",
              "Non-consecutive terms counted toward limit preventing circumvention through temporary absence",
              "Mid-term calculation: serving more than half a parliamentary term counts as full term",
              "Transitional provision applying from amendment enactment, not retroactively to current leaders"
            ]
          },
          {
            phase: "Democratic Benefits Implementation",
            title: "Leadership Renewal and Institution Building",
            items: [
              "Leadership renewal: encourages fresh ideas and prevents political stagnation",
              "Institutional strengthening: builds stronger party structures beyond individual personalities",
              "Generational opportunity: creates space for younger and emerging political leaders",
              "Power distribution: prevents excessive concentration of executive authority in single individual"
            ]
          },
          {
            phase: "Constitutional Process",
            title: "Amendment Procedure and Consensus Building",
            items: [
              "Constitutional amendment process through Article 274 procedure requiring 2/3 Parliamentary majority",
              "Provincial assembly consultation to build consensus across federal structure",
              "2-year process for full constitutional amendment completion with stakeholder engagement",
              "Public education campaign on democratic benefits of term limits and leadership rotation"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "United States two-term limit ensures regular executive renewal since 1951",
        "South Korea's single five-year term prevents power entrenchment",
        "Mexico's six-year single term contributed to political stability since 1917",
      ],
      long: [
        {
          country: "United States",
          details: "Two-term limit established by 22nd Amendment ensures regular executive renewal since 1951",
          impact: "Maintains policy continuity through institutions while preventing excessive individual power concentration"
        },
        {
          country: "South Korea",
          details: "Single five-year term creates clear leadership transition and prevents power entrenchment",
          impact: "Enables effective governance while preventing authoritarian consolidation of power through term limits"
        },
        {
          country: "Mexico",
          details: "Six-year single term (since 1917) contributed to political stability and prevented authoritarian rule",
          impact: "Demonstrates how term limits strengthen democracy by ensuring power rotation and institutional development"
        }
      ]
    },
    implementation: {
      short: [
        "Constitutional amendment process requiring 2/3 Parliamentary majority",
        "Consult provincial assemblies to build consensus",
        "2-year process for full constitutional amendment completion",
        "Public education campaign on democratic benefits of term limits",
      ],
      long: [
        {
          timeline: "Months 1-12",
          description: "Amendment Drafting and Coalition Building",
          details: [
            "Constitutional amendment drafting through Article 274 procedure with legal expert consultation",
            "Political coalition building for 2/3 Parliamentary majority with cross-party engagement",
            "Provincial assembly consultation process to build consensus across federal structure",
            "Public education campaign launch on democratic benefits of term limits"
          ]
        },
        {
          timeline: "Year 1-2",
          description: "Parliamentary Process and Stakeholder Engagement",
          details: [
            "Parliamentary debate and committee review process for constitutional amendment",
            "Stakeholder engagement including civil society, political parties, constitutional experts",
            "Provincial assembly feedback integration and consensus building activities",
            "Media campaign and public discourse on leadership renewal and democratic vitality"
          ]
        },
        {
          timeline: "Year 2",
          description: "Amendment Passage and Implementation",
          details: [
            "Constitutional amendment passage through 2/3 Parliamentary majority vote",
            "Presidential endorsement and constitutional promulgation process",
            "Implementation framework for term limit application and monitoring",
            "Institutional development encouragement beyond individual personalities for long-term democratic health"
          ]
        }
      ]
    },
    performanceTargets: [
      "Constitutional amendment passed within 2 years",
      "Clear succession planning encouraged in political parties",
      "Enhanced institutional development beyond individual personalities",
      "Regular leadership renewal ensuring democratic vitality",
    ],
    category: "Constitutional Reform",
    priority: "Medium",
    timeline: "2 years",
  },
  {
    id: "24",
    title: "Reform Government Property Management",
    description:
      "Transform disposal of seized vehicles and government property through transparent systems, educational donations, and revenue generation while protecting owner rights.",
    problem: {
      short: "Thousands of seized vehicles rot in police stations while students lack practical learning materials. Poor property management creates corruption opportunities and wastes resources.",
      long: "Thousands of seized vehicles rot in police stations while students lack practical learning materials for technical education. Government property management creates corruption opportunities and wastes public resources. The Public Property Protection Act provides disposal authority, but lack of transparent systems and clear procedures leads to inefficiency and potential misuse."
    },
    solution: {
      short: [
        "Set 6-month deadline for vehicle reclaim, then automatic public disposal",
        "Create digital registry with photos and case status for all seized vehicles",
        "Protect genuine owners' right to reclaim before disposal with proper documentation",
        "Donate non-roadworthy vehicles to technical schools for student training",
        "Sell roadworthy vehicles through transparent public online auctions",
      ],
      long: {
        phases: [
          {
            phase: "Transparent Vehicle Disposal System",
            title: "Digital Registry and Clear Procedures",
            items: [
              "6-month reclaim deadline: unclaimed seized vehicles automatically enter public disposal after deadline or final court decision",
              "Digital registry: online portal with photos, VIN numbers, case status, reclaim deadlines for all seized vehicles",
              "Owner protection: genuine owners can reclaim anytime before disposal by paying fines and presenting valid documents",
              "Legal framework establishment for transparent disposal procedures with due process protection"
            ]
          },
          {
            phase: "Educational Resource Program",
            title: "Technical Education Support",
            items: [
              "Technical school priority: non-roadworthy vehicles first offered to engineering colleges and vocational schools",
              "Student training projects: vehicle donation for mechanical training, EV retrofitting, innovation laboratories",
              "Research institution access: universities receive vehicles for automotive research and design projects",
              "Educational partnerships: formal agreements with technical institutions for vehicle donation programs"
            ]
          },
          {
            phase: "Revenue Generation System",
            title: "Transparent Auction and Recycling",
            items: [
              "Public online auctions: roadworthy vehicles sold through transparent bidding process",
              "Certified recycling: unrepairable vehicles sent to licensed dismantlers with transparent proceeds recording",
              "Treasury deposit: all auction and recycling proceeds go to national road safety fund or general treasury",
              "Performance measurement: tracking of disposal efficiency, educational benefit, and revenue generation"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Germany and Japan donate seized vehicles to technical universities for research",
        "India's technical institutes receive impounded vehicles for EV conversion projects",
        "Philippines' transparent auction system eliminated corruption while generating revenue",
      ],
      long: [
        {
          country: "Germany and Japan",
          details: "Donate seized vehicles to technical universities for research improving student practical skills",
          impact: "Solves storage problems while enhancing technical education and research capabilities"
        },
        {
          country: "India",
          details: "IIT and technical universities receive impounded vehicles for EV conversion projects",
          impact: "Combines waste reduction with innovation while providing practical learning opportunities for students"
        },
        {
          country: "Philippines",
          details: "Transparent vehicle auction system eliminated corruption in disposal while generating significant public revenue",
          impact: "Demonstrates how systematic approach can eliminate waste while creating public benefits"
        }
      ]
    },
    implementation: {
      short: [
        "Launch digital registry operational within 6 months",
        "Establish educational partnerships with technical institutions",
        "Set up transparent auction system integrated with government platforms",
        "Create legal framework for transparent disposal procedures",
      ],
      long: [
        {
          timeline: "Months 1-6",
          description: "Digital Registry and Legal Framework",
          details: [
            "Digital registry launch with online platform operational within 6 months",
            "Legal framework creation for transparent disposal procedures with owner protection",
            "Digital system integration with existing government platforms for seamless operation",
            "Staff training for police and administrative officials on new procedures"
          ]
        },
        {
          timeline: "Months 6-12",
          description: "Educational Partnerships and Auction System",
          details: [
            "Educational partnerships establishment with technical institutions for vehicle donations",
            "Transparent auction system establishment integrated with government procurement platforms",
            "Revenue tracking and treasury deposit system implementation",
            "Public awareness campaign on new disposal procedures and owner rights"
          ]
        },
        {
          timeline: "Months 12-18",
          description: "Full System Operation and Optimization",
          details: [
            "90% reduction in police station vehicle storage through efficient disposal system",
            "100 vehicles donated annually to educational institutions for practical training",
            "Significant revenue generation for road safety fund through transparent auctions",
            "50% increase in transparency of public property disposal with public accountability"
          ]
        }
      ]
    },
    performanceTargets: [
      "90% reduction in police station vehicle storage within 18 months",
      "100 vehicles donated to educational institutions annually",
      "50% increase in transparency of public property disposal",
      "Significant revenue generation for road safety fund",
    ],
    category: "Public Administration",
    priority: "Low",
    timeline: "18 months",
  },
  {
    id: "25",
    title: "Transform Healthcare System for Universal Coverage",
    description:
      "Revolutionize healthcare through strengthened rural infrastructure, qualified health workers, digital health systems, and universal insurance coverage for all Nepalis.",
    problem: {
      short: "Rural and marginalized communities face severe healthcare gaps due to underfunded facilities, lack of qualified doctors, poor infrastructure, creating preventable deaths and inequality.",
      long: "Rural and marginalized communities in Nepal face severe healthcare access gaps due to underfunded primary care, lack of qualified professionals, poor health infrastructure, and logistical challenges. Urban-rural disparities contribute to preventable deaths, untreated chronic illnesses, and broadening public health inequality. Article 35 guarantees health rights, but implementation lacks comprehensive coverage and quality services."
    },
    solution: {
      short: [
        "Upgrade Primary Health Centers with essential medicines, labs, maternity care, and telemedicine",
        "Train and deploy doctors, nurses, and community health workers to rural areas with incentives",
        "Create digital health platform with electronic health records and telemedicine services",
        "Expand government health insurance to all low-income and rural households",
        "Strengthen preventive services with vaccination, nutrition, and mental health programs",
      ],
      long: {
        phases: [
          {
            phase: "Strengthen Rural Healthcare Infrastructure",
            title: "Primary Care Expansion and Accessibility",
            items: [
              "Map underserved rural and mountainous regions for primary healthcare expansion with FREE care services",
              "Construct and upgrade Primary Health Centers with essential medicines, labs, maternity care, telemedicine rooms",
              "Provide door-to-door health services through community health workers bridging gaps between communities",
              "Solar power and internet connectivity in remote posts with clean water, sanitation, emergency transport"
            ]
          },
          {
            phase: "Human Resource for Health Strategy",
            title: "Qualified Health Worker Deployment",
            items: [
              "Rural doctor and nurse quotas with service bonds, hardship allowances, housing incentives",
              "Mid-level healthcare workers (ANMs, CMAs, public health nurses) trained and deployed locally",
              "Partner with medical universities for rural health residency tracks and e-learning delivery",
              "Transparent licensing exams with independent oversight and public reporting for fairness"
            ]
          },
          {
            phase: "Digital Health and Universal Coverage",
            title: "Technology Integration and Insurance Expansion",
            items: [
              "Electronic Health Record (EHR) system for accurate real-time data and continuity of care",
              "National Digital Health Platform for telemedicine, e-prescriptions, referrals, inventory management",
              "Expand government-subsidized health insurance to all low-income and rural households",
              "Integrate mental health services into PHCs with tele-counseling and community mobilization"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Thailand's Universal Coverage reduced catastrophic health spending by 30%",
        "Sri Lanka achieved strong health outcomes despite low per-capita spending through equity focus",
        "Rwanda integrated digital health, reducing child mortality by over 60% in a decade",
        "Ethiopia's Health Extension Program trained 40,000 female health workers",
      ],
      long: [
        {
          country: "Thailand",
          details: "Universal Coverage Scheme expanded rural access and reduced catastrophic health spending by 30%",
          impact: "Achieved high citizen satisfaction through rural health investment and insurance expansion"
        },
        {
          country: "Sri Lanka",
          details: "Achieved strong maternal/child health outcomes despite low per-capita spending by focusing on equity",
          impact: "Demonstrates effectiveness of preventive care and rural health investment over expensive urban facilities"
        },
        {
          country: "Rwanda",
          details: "Integrated digital health and community health workers to expand access in post-conflict setting",
          impact: "Reduced child mortality by over 60% in a decade through community-based insurance and accountability"
        },
        {
          country: "Ethiopia",
          details: "Health Extension Program trained 40,000 female health workers for community-based service delivery",
          impact: "Improved immunization and maternal survival through scalable grassroots health delivery model"
        }
      ]
    },
    implementation: {
      short: [
        "Year 1: Map health facilities, start health worker training, initiate digital platform",
        "Years 2-3: Construct health posts, expand services, enforce insurance coverage",
        "Years 4-5: Full system operation, nationwide digital coverage, universal rural access",
      ],
      long: [
        {
          timeline: "Year 1",
          description: "System Mapping and Foundation Building",
          details: [
            "Comprehensive health facility mapping with health worker relicensing launch",
            "Independent Health Regulatory Authority (IHRA) setup for quality assurance",
            "National Digital Health Platform (NDHP) initiation with EHR system development",
            "Community mobilization with youth-led health education campaigns"
          ]
        },
        {
          timeline: "Years 2-3",
          description: "Infrastructure Development and Service Expansion",
          details: [
            "Health post construction with model hospitals and disaster-resilient facilities",
            "Non-Communicable Disease (NCD) and Maternal & Child Health (MCH) service expansion",
            "Health insurance rollout with private hospital regulation enforcement",
            "Supply chain strengthening with digital systems training for health workers"
          ]
        },
        {
          timeline: "Years 4-5",
          description: "Full System Operation and Universal Coverage",
          details: [
            "Full system operation with nationwide digital health record coverage",
            "Universal rural coverage achievement with quality audits and performance monitoring",
            "Telemedicine and WASH program expansion to all primary health facilities",
            "System optimization based on health outcomes and citizen satisfaction metrics"
          ]
        }
      ]
    },
    performanceTargets: [
      "95% population within 30 minutes of primary health facility within 5 years",
      "50% reduction in catastrophic out-of-pocket health spending",
      "90% health insurance enrollment among low-income households",
      "80% of health facilities using digital health records",
    ],
    category: "Healthcare",
    priority: "High",
    timeline: "5 years",
  },
  {
    id: "26",
    title: "Overhaul Social Protection System",
    description:
      "Transform fragmented social protection into comprehensive life-cycle security covering health, education, employment, and caregiving with enhanced inclusion and sustainability.",
    problem: {
      short: "Social protection is fragmented, underfunded, and inadequate. Children, working-age people, and informal workers lack protection, while benefits are too small and system is unresponsive to crises.",
      long: "Social protection system remains fragmented, underfunded, and inadequate with uneven coverage. Children, working-age people, and informal workers are largely underprotected creating a substantial 'missing middle.' Benefits are too small to meet basic needs while spending is heavily skewed toward public pensions. Over 70 fragmented programs across ministries create duplication and weak coordination, while limited shock-responsiveness leaves people exposed during crises."
    },
    solution: {
      short: [
        "Universalize child grants and extend coverage to informal workers",
        "Raise benefit levels and rebalance spending from pensions to children and working-age groups",
        "Create shock-responsive systems that adapt quickly to disasters and economic crises",
        "Strengthen legal frameworks guaranteeing universal social protection programmes",
        "Ensure sustainable financing through balanced contributory and non-contributory schemes",
      ],
      long: {
        phases: [
          {
            phase: "Expand Coverage and Improve Adequacy",
            title: "Universal Protection and Enhanced Benefits",
            items: [
              "Universalize child grants nationwide reaching all children under five, progressively extending to all children",
              "Extend support to school-aged children with contributory options for informal workers",
              "Raise benefit levels to cover at least 15% of Minimum Expenditure Basket by 2028",
              "Rebalance spending so 40% of social protection budget benefits children, women, and working-age people"
            ]
          },
          {
            phase: "Integrate Shock-Responsive Systems",
            title: "Crisis-Adaptive Social Protection",
            items: [
              "Make schemes adaptable to crises integrating SRSP guidelines into existing programmes",
              "Preposition shock-scalable delivery protocols with pre-identified beneficiary lists and rapid payments",
              "Operationalize scalable delivery so 90% of disaster-affected households receive support within 14 days",
              "Integrate shock-responsive protocols into all major transfer programmes"
            ]
          },
          {
            phase: "Strengthen Legal and Institutional Frameworks",
            title: "Comprehensive System Coordination",
            items: [
              "Operationalize Integrated National Social Protection Framework with clear coordination structure",
              "Guarantee universal programmes in law through Social Security Act implementation",
              "Create inter-agency Social Protection Council to align policy, budgets, and responses",
              "Establish unified social protection registry covering 80% of eligible households linked to NID system"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "Brazil's Bolsa Família demonstrates large-scale child transfers with strong registry systems",
        "Ethiopia's PSNP provides multi-year transfers with shock-responsive design for disasters",
        "Indonesia extended health insurance to informal workers through subsidies",
        "South Africa's Child Support Grant shows predictable transfers reduce poverty significantly",
      ],
      long: [
        {
          country: "Brazil",
          details: "Bolsa Família demonstrates large-scale child cash transfers with strong registry use",
          impact: "Lesson for Nepal: legalize and scale child grants, link to complementary services"
        },
        {
          country: "Ethiopia",
          details: "PSNP provides multi-year transfers with shock-responsive design for disasters",
          impact: "Lesson: scale existing programmes to deliver anticipatory disaster support"
        },
        {
          country: "Indonesia",
          details: "BPJS extended health/social insurance to informal workers via subsidies and pooled financing",
          impact: "Lesson: adopt subsidy tiers and simplified enrolment for informal/self-employed workers"
        },
        {
          country: "South Africa",
          details: "Child Support Grant provides predictable child transfers with proven poverty-reduction impact",
          impact: "Lesson: increase adequacy and prioritize child benefits for maximum development impact"
        }
      ]
    },
    implementation: {
      short: [
        "Operationalize Integrated National Social Protection Framework immediately",
        "Upgrade to unified beneficiary registry linked with national ID system",
        "Phase in expansion of child grants and contributory options for informal workers",
        "Create inter-agency Social Protection Council for coordination",
      ],
      long: [
        {
          timeline: "Years 1-2",
          description: "Framework Operationalization and System Integration",
          details: [
            "Fully operationalize Integrated National Social Protection Framework with coordination structure",
            "Upgrade to unified beneficiary registry linked with NID system excluding no vulnerable groups",
            "Social Security Act full implementation with concrete rules for informal sector inclusion",
            "Inter-agency Social Protection Council creation for policy, budget, and response alignment"
          ]
        },
        {
          timeline: "Years 2-4",
          description: "Coverage Expansion and Benefit Enhancement",
          details: [
            "Phase in expansion of child grants with school-age children inclusion",
            "Contributory options introduction for informal workers with subsidy tiers",
            "Maternity, disability, and unemployment insurance strengthening through Social Security Fund",
            "Shock-responsive delivery systems operationalization with rapid response capabilities"
          ]
        },
        {
          timeline: "Years 4-5",
          description: "Universal Coverage and System Optimization",
          details: [
            "50% population coverage achievement by 2027 moving towards 60% by 2030",
            "Universal Child Grant implementation nationwide with progressive extension",
            "2,500,000 active contributors to Social Security Fund achievement by 2028/29",
            "Sustainable financing secured equivalent to at least 10% of national budget"
          ]
        }
      ]
    },
    performanceTargets: [
      "50% population coverage by 2027, moving towards 60% by 2030",
      "Universalize Child Grant nationwide reaching all children under five",
      "2,500,000 active contributors to Social Security Fund by 2028/29",
      "40% of social protection budget benefits children, women, and working-age people",
    ],
    category: "Social Protection",
    priority: "High",
    timeline: "5 years",
  },
  {
    id: "27",
    title: "Reform Financial Management System",
    description:
      "Modernize public financial management through integrated systems, citizen budget portals, scientific budgeting, and strengthened oversight to eliminate waste and enhance accountability.",
    problem: {
      short: "Financial management suffers from fragmented systems, weak accountability, oversized budgets, low spending rates, and limited public scrutiny enabling inefficiency and corruption.",
      long: "Public financial management suffers from fragmented systems, weak accountability, and outdated processes. LMBIS, Provincial LMBIS, SuTRA, and RMS are not interoperable while budgeting and expenditure decisions are disconnected from implementation. Oversized budgets, low absorption rates, inflated projections, discretionary staff transfers, and weak oversight mechanisms dilute accountability. Citizens lack access to real-time ward-level budget data preventing informed participation."
    },
    solution: {
      short: [
        "Connect all government financial systems so they work together and share information",
        "Create citizen budget portal showing real-time ward-level budget and spending data",
        "Replace National Planning Commission with Finance Ministry planning division",
        "Enforce strict budget limits and prevent staff transfers during fiscal years",
        "Establish Parliamentary Budget Office and make performance audits mandatory",
      ],
      long: {
        phases: [
          {
            phase: "System Integration and Transparency",
            title: "Interoperable Financial Systems and Citizen Access",
            items: [
              "Integrate financial systems making LMBIS, Provincial LMBIS, SuTRA, RMS interoperable within 1-2 years",
              "Citizen budget portal providing real-time ward-level budget and implementation data for public scrutiny",
              "Scientific budgeting ensuring revenue and expenditure projections are evidence-based with accountability",
              "Complete system interoperability with citizen-friendly interface and mobile SMS alerts"
            ]
          },
          {
            phase: "Procurement Reform and Legal Protection",
            title: "Digital Procurement and Bureaucratic Protection",
            items: [
              "Amend Public Procurement Act to protect bureaucrats acting in good faith from arbitrary prosecution",
              "Digitize procurement processes prioritizing performance and quality over lowest price",
              "Enforce strong Conflict of Interest rules with transparent compliance monitoring",
              "Performance-based bid evaluation replacing automatic lowest-bidder selection"
            ]
          },
          {
            phase: "Planning Streamline and Oversight Strengthening",
            title: "Fiscal Discipline and Enhanced Accountability",
            items: [
              "Replace National Planning Commission with planning division in Ministry of Finance",
              "Enforce hard budget constraints following Mid-Term Expenditure Report guidelines",
              "Establish Parliamentary Budget Office for independent budget oversight and analysis",
              "Mandatory performance audits by Auditor General alongside legal compliance audits"
            ]
          }
        ]
      }
    },
    realWorldEvidence: {
      short: [
        "South Korea, Chile, and Philippines have citizen budget portals enabling real-time transparency",
        "India and Philippines show mandatory performance audits improve project outcomes",
        "Kenya and Rwanda demonstrate digitized procurement reduces corruption",
        "New Zealand's hard budget constraints achieve higher execution rates",
      ],
      long: [
        {
          country: "Global Best Practice",
          details: "Countries like South Korea, Chile, and Philippines have citizen budget portals and integrated financial management systems",
          impact: "Enable real-time transparency and improved fiscal discipline through citizen oversight"
        },
        {
          country: "Performance Audit Success",
          details: "India and Philippines demonstrate mandatory performance audits improve project outcomes",
          impact: "Reduced misuse of funds and better value-for-money through systematic performance evaluation"
        },
        {
          country: "Digital Procurement Benefits",
          details: "Kenya and Rwanda show digitized procurement with conflict-of-interest rules reduces corruption",
          impact: "Improved value for money and transparent processes through systematic digitization"
        },
        {
          country: "Budget Discipline",
          details: "New Zealand's adherence to hard budget constraints and evidence-based projections",
          impact: "Achieved higher budget execution rates and more efficient public spending"
        }
      ]
    },
    implementation: {
      short: [
        "Complete system integration and launch citizen portal within 1-2 years",
        "Reform procurement with digitized processes and legal protections",
        "Restructure planning and enforce budget discipline through institutional changes",
        "Establish Parliamentary Budget Office with enhanced oversight powers",
      ],
      long: [
        {
          timeline: "Months 1-12",
          description: "System Integration and Portal Development",
          details: [
            "Map all existing financial management systems (LMBIS, Provincial LMBIS, SuTRA, RMS)",
            "Design and develop interoperable platform linking all systems with citizen access",
            "Build citizen budget portal with ward-level real-time budget and expenditure data",
            "Conduct training for officials on proper usage, data entry, and transparency requirements"
          ]
        },
        {
          timeline: "Months 12-24",
          description: "Procurement Reform and Legal Framework",
          details: [
            "Amend Public Procurement Act providing legal protection for good faith bureaucratic actions",
            "Digitize procurement processes with performance-based evaluation of bids",
            "Strengthen Conflict of Interest rules and enforce strict compliance monitoring",
            "Establish Parliamentary Budget Office for independent budget oversight and analysis"
          ]
        },
        {
          timeline: "Year 2",
          description: "Planning Restructure and Oversight Enhancement",
          details: [
            "Close National Planning Commission and establish planning division in Ministry of Finance",
            "Enforce hard budget constraints following Mid-Term Expenditure Report guidelines",
            "Require performance audits by Auditor General alongside compliance audits",
            "Complete system optimization with 50% improvement in budget execution efficiency"
          ]
        }
      ]
    },
    performanceTargets: [
      "Complete system interoperability within 2 years",
      "Real-time ward-level budget data accessible to all citizens",
      "Scientific budgeting with evidence-based projections",
      "50% improvement in budget execution efficiency",
    ],
    category: "Financial Management",
    priority: "High",
    timeline: "2 years",
  },
]

export function getManifestoItemById(id: string): ManifestoItem | undefined {
  return manifestoData.find((item) => item.id === id || item.id === String(id))
}

export function getManifestoItemsByCategory(category: string): ManifestoItem[] {
  const norm = category.toLowerCase().trim()
  return manifestoData.filter((item) => item.category.toLowerCase().includes(norm))
}

export function getAllCategories(): string[] {
  return [...new Set(manifestoData.map((item) => item.category))]
}

export function searchManifesto(query: string, limit = 5): Array<ManifestoItem & { score: number; matchReasons: string[] }> {
  if (!query || query.trim().length === 0) {
    return manifestoData.slice(0, limit).map(item => ({ ...item, score: 1, matchReasons: ["Default recommendation"] }))
  }

  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1)
  
  const results = manifestoData.map((item) => {
    let score = 0
    const matchReasons: string[] = []
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()
    const problemLower = (item.problem.short + " " + item.problem.long).toLowerCase()
    const categoryLower = item.category.toLowerCase()
    const solutionLower = item.solution.short.join(" ").toLowerCase()
    const evidenceLower = item.realWorldEvidence.short.join(" ").toLowerCase()

    // Exact ID check
    if (query.trim() === item.id) {
      score += 100
      matchReasons.push(`Exact Reform #${item.id} match`)
    }

    terms.forEach(term => {
      if (titleLower.includes(term)) {
        score += 15
        matchReasons.push(`Title match: "${term}"`)
      }
      if (categoryLower.includes(term)) {
        score += 10
        matchReasons.push(`Category match: "${term}"`)
      }
      if (solutionLower.includes(term)) {
        score += 8
        matchReasons.push(`Solution match: "${term}"`)
      }
      if (problemLower.includes(term)) {
        score += 5
        matchReasons.push(`Problem match: "${term}"`)
      }
      if (evidenceLower.includes(term)) {
        score += 4
        matchReasons.push(`Evidence match: "${term}"`)
      }
      if (descLower.includes(term)) {
        score += 3
      }
    })

    return {
      ...item,
      score,
      matchReasons: [...new Set(matchReasons)]
    }
  })

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getBriefReformList(): Array<{ id: string; title: string; category: string; priority: string; timeline: string }> {
  return manifestoData.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    priority: item.priority,
    timeline: item.timeline
  }))
}

