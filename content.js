// Per-example timings follow the current supplementary deck.
// Makespan is execution time. RL excerpts have playback timers, not makespans.
window.CUARMS_FEATURED = [
  { id: 'highlight-demos', title: 'Highlights', duration: 72.5, caption: 'cuArms on real robots, multi-arm welding, tabletop task and motion planning, coding agents as the scheduler, and long-horizon assembly benchmarks.' },
  { id: 'handover', title: 'Bimanual Handover', duration: 20, aspect: '1280 / 790', caption: 'Two arms execute a pick, handover, and place sequence to reorient an object.' },
  { id: 'carry', title: 'Bimanual Carry', duration: 24, aspect: '1280 / 790', caption: 'Two arms grasp and carry a shared object into place.' },
  { id: 'kinova-stack', title: 'Bimanual Block Stacking', duration: 42.5, speed: 2, aspect: '16 / 9', caption: 'Two Kinova arms coordinate pick-and-place motions to stack blocks into a single tower.' },
  { id: 'kinova', title: 'Bimanual TableTop Packing', duration: 71.2, speed: 2, caption: 'Two Kinova arms coordinate pick-and-place motions to pack blocks into a shared region.' },
  { id: 'supplementary', title: 'Full Supplementary Video', duration: 176.233333, caption: 'The complete anonymous supplementary video, including real-robot experiments, baseline comparisons, object scaling, and additional results.' },
];

// The Method section's walkthrough, under Fig. 2.
window.CUARMS_METHOD = [
  { id: 'highlight-method', title: 'How cuArms Works', duration: 53.1, caption: 'From a task and its schedule to a synchronized multi-arm plan: per-arm roadmaps, conflict-driven search with GPU conflict checks, and batched shortcuts, on a 2D example.' },
];

window.CUARMS_WELDING = [
  { id: 'welding4', title: '4 arms · 40 targets', label: '4 arms', clips: [
    { id: 'welding-4-cuarms', title: 'cuArms', planning: 7.90, duration: 16.2 },
    { id: 'welding-4-baseline', title: 'RoboBallet RL [1]', duration: 20, excerpt: true },
  ] },
  { id: 'welding8', title: '8 arms · 40 targets', label: '8 arms', clips: [
    { id: 'welding-8-cuarms', title: 'cuArms', planning: 9.26, duration: 9.7 },
    { id: 'welding-8-baseline', title: 'RoboBallet RL [1]', duration: 20, excerpt: true },
  ] },
];

window.CUARMS_TABLETOP = [
  { id: 'stack', title: 'Stack four objects', label: 'Stack', clips: [
    { id: 'stack-4-cuarms', title: 'cuArms', planning: 4.67, duration: 10.2 },
    { id: 'stack-4-baseline', title: 'ScheduleStream [2]', planning: 3.66, duration: 20.15 },
  ] },
  { id: 'unpack', title: 'Unpack four objects', label: 'Unpack', clips: [
    { id: 'unpack-4-cuarms', title: 'cuArms', planning: 5.34, duration: 11.175 },
    { id: 'unpack-4-baseline', title: 'ScheduleStream [2]', planning: 5.15, duration: 21.825 },
  ] },
  { id: 'pack', title: 'Pack four objects', label: 'Pack', clips: [
    { id: 'pack-4-cuarms', title: 'cuArms', planning: 22.75, duration: 9.425 },
    { id: 'pack-4-baseline', title: 'ScheduleStream [2]', planning: 22.51, duration: 22 },
  ] },
];

// Rows are object counts; columns are packing and unpacking, as in the deck.
window.CUARMS_SCALING = [
  { id: 'pack-6-cuarms', title: 'Pack · 6 objects', scheduling: 37.49, solution: 4.06, duration: 14.433333 },
  { id: 'unpack-6-cuarms', title: 'Unpack · 6 objects', scheduling: 8.04, solution: 4.17, duration: 17.333333 },
  { id: 'pack-8-cuarms', title: 'Pack · 8 objects', scheduling: 39.34, solution: 4.20, duration: 17.733333 },
  { id: 'unpack-8-cuarms', title: 'Unpack · 8 objects', scheduling: 49.41, solution: 4.22, duration: 18.033333 },
];

// Original-speed files; playbackRate matches the supplementary presentation.
// currentTime remains execution time, including when playback is accelerated.
window.CUARMS_ASSEMBLIES = [
  { id: 'assembly-spiral2', title: 'Two-arm spiral', planning: 2.85, duration: 12.633333 },
  { id: 'assembly-truss', title: 'Truss', planning: 11.70, duration: 26.233333, speed: 2 },
  { id: 'assembly-spiral4', title: 'Four-arm spiral', planning: 10.23, duration: 26.966667, speed: 2 },
  { id: 'assembly-cube', title: 'Cube', planning: 15.57, duration: 36.533333, speed: 3 },
];

// One xECBS query per scene. The files are slowed 4x with the start and final poses held; the
// benchmark scores joint distance (cost, rad), not time, so the cards show no makespan timer.
// initial: time to the first solution; planning: first solution + 1 s (bin picking, 6 arms) or
// 6 s (shelves, 8 arms) of refinement; roadmaps excluded.
window.CUARMS_XECBS = [
  { id: 'xecbs-binpick', title: 'Bin picking · 4 arms', initial: 0.12, planning: 1.26, cost: 27.21, timer: false, duration: 7.9 },
  { id: 'xecbs-shelves', title: 'Shelves · 8 arms', initial: 4.58, planning: 11.10, cost: 49.04, timer: false, duration: 7.7 },
  { id: 'xecbs-6', title: 'Circle · 6 arms', initial: 0.08, planning: 1.15, cost: 34.18, timer: false, duration: 8.9 },
  { id: 'xecbs-8', title: 'Circle · 8 arms', initial: 0.13, planning: 6.28, cost: 42.53, timer: false, duration: 8.133333 },
];

// LEGO assembly on the dual-GP4 cell, cuArms seed 0, each arm at its own pace (TPG execution).
// Real-time files (a frame per 0.5 s of plan) played fast, so the timer shows execution time.
// initial, planning: median time to the first and the final plan over seeds 0-4, with 5 s of
// refinement (20 s on Big Chair).
window.CUARMS_LEGO = [
  { id: 'lego-fish-cuarms', title: 'Fish · 29 bricks', initial: 3.30, planning: 8.6, duration: 350.5, speed: 10 },
  { id: 'lego-vessel-cuarms', title: 'Vessel · 36 bricks', initial: 2.18, planning: 7.3, duration: 267.6, speed: 10 },
  { id: 'lego-faucet-cuarms', title: 'Faucet · 14 bricks', initial: 0.86, planning: 4.0, duration: 159.7, speed: 10 },
  { id: 'lego-cliff-cuarms', title: 'Cliff · 12 bricks', initial: 1.37, planning: 2.5, duration: 142.2, speed: 10 },
  { id: 'lego-rss-cuarms', title: 'RSS · 47 bricks', initial: 3.15, planning: 8.5, duration: 448.6, speed: 10 },
  { id: 'lego-big-chair-cuarms', title: 'Big Chair · 258 bricks', initial: 13.64, planning: 36.5, duration: 1644.4, speed: 16 },
];

// BEGIN CUARMS_AGENTS (generated)
window.CUARMS_AGENTS = [
  {
    "title": "Tabletop manipulation",
    "description": "The hand-engineered scheduler is ScheduleStream. After optimizing the motion of its first schedule skeleton, it explores up to 16 alternative skeletons, so its planning time is longer than in Experiment 2, which plans one skeleton. The cases start from the same states as Experiment 2 and its scaling results; Stack 4 (layout 2) is an instance from our benchmark set.",
    "groups": [
      {
        "title": "Tabletop cases",
        "choose": "a case",
        "options": [
          {
            "id": "agents-tabletop-stack4-s5",
            "label": "Stack 4",
            "title": "Stack 4 objects",
            "clips": [
              {
                "id": "agent-tabletop-stack4-s5-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 9.713,
                "aspect": "1280 / 954",
                "planning": 43.23
              },
              {
                "id": "agent-tabletop-stack4-s5-opus",
                "title": "Opus + cuArms",
                "duration": 6.011,
                "aspect": "1280 / 954",
                "session": 8.4
              },
              {
                "id": "agent-tabletop-stack4-s5-astra",
                "title": "Astra + cuArms",
                "duration": 3.956,
                "aspect": "1280 / 954",
                "session": 16.1
              }
            ]
          },
          {
            "id": "agents-tabletop-stack4-s100",
            "label": "Stack 4 (layout 2)",
            "title": "Stack 4 objects",
            "clips": [
              {
                "id": "agent-tabletop-stack4-s100-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 9.253,
                "aspect": "1280 / 954",
                "planning": 41.1
              },
              {
                "id": "agent-tabletop-stack4-s100-opus",
                "title": "Opus + cuArms",
                "duration": 6.899,
                "aspect": "1280 / 954",
                "session": 6.4
              },
              {
                "id": "agent-tabletop-stack4-s100-astra",
                "title": "Astra + cuArms",
                "duration": 5.771,
                "aspect": "1280 / 954",
                "session": 10.7
              }
            ]
          },
          {
            "id": "agents-tabletop-unpack4-s5",
            "label": "Unpack 4",
            "title": "Unpack 4 objects",
            "clips": [
              {
                "id": "agent-tabletop-unpack4-s5-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 9.121,
                "aspect": "1280 / 954",
                "planning": 50.48
              },
              {
                "id": "agent-tabletop-unpack4-s5-opus",
                "title": "Opus + cuArms",
                "duration": 6.538,
                "aspect": "1280 / 954",
                "session": 6.6
              },
              {
                "id": "agent-tabletop-unpack4-s5-astra",
                "title": "Astra + cuArms",
                "duration": 3.768,
                "aspect": "1280 / 954",
                "session": 17.1
              }
            ]
          },
          {
            "id": "agents-tabletop-pack4-s0",
            "label": "Pack 4",
            "title": "Pack 4 objects",
            "clips": [
              {
                "id": "agent-tabletop-pack4-s0-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 8.85,
                "aspect": "1280 / 954",
                "planning": 76.14
              },
              {
                "id": "agent-tabletop-pack4-s0-opus",
                "title": "Opus + cuArms",
                "duration": 6.864,
                "aspect": "1280 / 954",
                "session": 6.3
              },
              {
                "id": "agent-tabletop-pack4-s0-astra",
                "title": "Astra + cuArms",
                "duration": 2.855,
                "aspect": "1280 / 954",
                "session": 16.9
              }
            ]
          },
          {
            "id": "agents-tabletop-unpack8-s13",
            "label": "Unpack 8",
            "title": "Unpack 8 objects",
            "clips": [
              {
                "id": "agent-tabletop-unpack8-s13-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 16.899,
                "aspect": "1280 / 954",
                "planning": 85.14
              },
              {
                "id": "agent-tabletop-unpack8-s13-opus",
                "title": "Opus + cuArms",
                "duration": 9.351,
                "aspect": "1280 / 954",
                "session": 7.3
              },
              {
                "id": "agent-tabletop-unpack8-s13-astra",
                "title": "Astra + cuArms",
                "duration": 8.42,
                "aspect": "1280 / 954",
                "session": 18.9
              }
            ]
          },
          {
            "id": "agents-tabletop-pack8-s14",
            "label": "Pack 8",
            "title": "Pack 8 objects",
            "clips": [
              {
                "id": "agent-tabletop-pack8-s14-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 17.082,
                "aspect": "1280 / 954",
                "planning": 97.71
              },
              {
                "id": "agent-tabletop-pack8-s14-opus",
                "title": "Opus + cuArms",
                "duration": 12.066,
                "aspect": "1280 / 954",
                "session": 8.1
              },
              {
                "id": "agent-tabletop-pack8-s14-astra",
                "title": "Astra + cuArms",
                "duration": 5.925,
                "aspect": "1280 / 954",
                "session": 19.2
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "title": "Multi-arm welding (RoboBallet)",
    "description": "The hand-engineered scheduler assigns weld targets to arms by greedy Hungarian matching. After optimizing the motion of its first schedule skeleton, it explores up to 16 alternative skeletons, so its planning time is longer than in Experiment 1, which plans one skeleton. The episodes are RoboBallet benchmark episodes, as in Experiment 1.",
    "groups": [
      {
        "title": "4 arms · 40 targets",
        "choose": "an episode",
        "options": [
          {
            "id": "agents-welding-4-ep0",
            "label": "Episode 0",
            "title": "4 arms · 40 targets · episode 0",
            "clips": [
              {
                "id": "agent-welding-4-ep0-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 16.534,
                "aspect": "16 / 9",
                "planning": 105.59
              },
              {
                "id": "agent-welding-4-ep0-opus",
                "title": "Opus + cuArms",
                "duration": 18.932,
                "aspect": "16 / 9",
                "session": 7.2
              },
              {
                "id": "agent-welding-4-ep0-astra",
                "title": "Astra + cuArms",
                "duration": 14.745,
                "aspect": "16 / 9",
                "session": 18.8
              }
            ]
          },
          {
            "id": "agents-welding-4-ep1",
            "label": "Episode 1",
            "title": "4 arms · 40 targets · episode 1",
            "clips": [
              {
                "id": "agent-welding-4-ep1-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 17.633,
                "aspect": "16 / 9",
                "planning": 107.0
              },
              {
                "id": "agent-welding-4-ep1-opus",
                "title": "Opus + cuArms",
                "duration": 17.196,
                "aspect": "16 / 9",
                "session": 10.3
              },
              {
                "id": "agent-welding-4-ep1-astra",
                "title": "Astra + cuArms",
                "duration": 16.284,
                "aspect": "16 / 9",
                "session": 19.6
              }
            ]
          },
          {
            "id": "agents-welding-4-ep2",
            "label": "Episode 2",
            "title": "4 arms · 40 targets · episode 2",
            "clips": [
              {
                "id": "agent-welding-4-ep2-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 16.486,
                "aspect": "16 / 9",
                "planning": 105.85
              },
              {
                "id": "agent-welding-4-ep2-opus",
                "title": "Opus + cuArms",
                "duration": 31.007,
                "aspect": "16 / 9",
                "session": 10.6
              },
              {
                "id": "agent-welding-4-ep2-astra",
                "title": "Astra + cuArms",
                "duration": 17.345,
                "aspect": "16 / 9",
                "session": 17.5
              }
            ]
          },
          {
            "id": "agents-welding-4-ep3",
            "label": "Episode 3",
            "title": "4 arms · 40 targets · episode 3",
            "clips": [
              {
                "id": "agent-welding-4-ep3-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 15.301,
                "aspect": "16 / 9",
                "planning": 107.41
              },
              {
                "id": "agent-welding-4-ep3-opus",
                "title": "Opus + cuArms",
                "duration": 19.674,
                "aspect": "16 / 9",
                "session": 8.0
              },
              {
                "id": "agent-welding-4-ep3-astra",
                "title": "Astra + cuArms",
                "duration": 15.041,
                "aspect": "16 / 9",
                "session": 18.9
              }
            ]
          }
        ]
      },
      {
        "title": "8 arms · 40 targets",
        "choose": "an episode",
        "options": [
          {
            "id": "agents-welding-8-ep0",
            "label": "Episode 0",
            "title": "8 arms · 40 targets · episode 0",
            "clips": [
              {
                "id": "agent-welding-8-ep0-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 13.013,
                "aspect": "16 / 9",
                "planning": 111.85
              },
              {
                "id": "agent-welding-8-ep0-opus",
                "title": "Opus + cuArms",
                "duration": 13.772,
                "aspect": "16 / 9",
                "session": 20.0
              },
              {
                "id": "agent-welding-8-ep0-astra",
                "title": "Astra + cuArms",
                "duration": 12.45,
                "aspect": "16 / 9",
                "session": 18.5
              }
            ]
          },
          {
            "id": "agents-welding-8-ep2",
            "label": "Episode 1",
            "title": "8 arms · 40 targets · episode 2",
            "clips": [
              {
                "id": "agent-welding-8-ep2-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 13.967,
                "aspect": "16 / 9",
                "planning": 113.71
              },
              {
                "id": "agent-welding-8-ep2-opus",
                "title": "Opus + cuArms",
                "duration": 13.9,
                "aspect": "16 / 9",
                "session": 10.7
              },
              {
                "id": "agent-welding-8-ep2-astra",
                "title": "Astra + cuArms",
                "duration": 17.191,
                "aspect": "16 / 9",
                "session": 20.0
              }
            ]
          },
          {
            "id": "agents-welding-8-ep3",
            "label": "Episode 2",
            "title": "8 arms · 40 targets · episode 3",
            "clips": [
              {
                "id": "agent-welding-8-ep3-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 12.866,
                "aspect": "16 / 9",
                "planning": 113.12
              },
              {
                "id": "agent-welding-8-ep3-opus",
                "title": "Opus + cuArms",
                "duration": 13.471,
                "aspect": "16 / 9",
                "session": 15.8
              },
              {
                "id": "agent-welding-8-ep3-astra",
                "title": "Astra + cuArms",
                "duration": 9.954,
                "aspect": "16 / 9",
                "session": 20.0
              }
            ]
          },
          {
            "id": "agents-welding-8-ep5",
            "label": "Episode 3",
            "title": "8 arms · 40 targets · episode 5",
            "clips": [
              {
                "id": "agent-welding-8-ep5-handwritten",
                "title": "Hand-engineered scheduler + cuArms",
                "duration": 9.548,
                "aspect": "16 / 9",
                "planning": 110.72
              },
              {
                "id": "agent-welding-8-ep5-opus",
                "title": "Opus + cuArms",
                "duration": 15.889,
                "aspect": "16 / 9",
                "session": 15.4
              },
              {
                "id": "agent-welding-8-ep5-astra",
                "title": "Astra + cuArms",
                "duration": 11.423,
                "aspect": "16 / 9",
                "session": 18.1
              }
            ]
          }
        ]
      }
    ]
  }
];
window.CUARMS_INTENT = {
  "title": "Tasks",
  "choose": "a task",
  "options": [
    {
      "id": "intent-handover-flip-x-p0",
      "label": "Handover 1",
      "title": "Handover 1",
      "clips": [
        {
          "id": "agent-intent-speed-astra-handover-flip-x-p0",
          "title": "Speed only",
          "duration": 12.135,
          "aspect": "16 / 9",
          "session": 7.4,
          "execution": true
        },
        {
          "id": "agent-intent-balanced-astra-handover-flip-x-p0",
          "title": "Speed and smoothness",
          "duration": 17.861,
          "aspect": "16 / 9",
          "session": 14.8,
          "execution": true
        }
      ],
      "cols": 2,
      "table": {
        "columns": [
          "",
          "Peak joint speed (rad/s)",
          "Tool path / straight line"
        ],
        "rows": [
          [
            "Speed only",
            "2.8",
            "1.38"
          ],
          [
            "Speed and smoothness",
            "1.7",
            "1.00"
          ]
        ]
      }
    },
    {
      "id": "intent-handover-flip-y-p0",
      "label": "Handover 2",
      "title": "Handover 2",
      "clips": [
        {
          "id": "agent-intent-speed-astra-handover-flip-y-p0",
          "title": "Speed only",
          "duration": 11.093,
          "aspect": "16 / 9",
          "session": 8.2,
          "execution": true
        },
        {
          "id": "agent-intent-balanced-astra-handover-flip-y-p0",
          "title": "Speed and smoothness",
          "duration": 23.64,
          "aspect": "16 / 9",
          "session": 19.5,
          "execution": true
        }
      ],
      "cols": 2,
      "table": {
        "columns": [
          "",
          "Peak joint speed (rad/s)",
          "Tool path / straight line"
        ],
        "rows": [
          [
            "Speed only",
            "2.5",
            "1.72"
          ],
          [
            "Speed and smoothness",
            "2.0",
            "1.16"
          ]
        ]
      }
    }
  ]
};
// END CUARMS_AGENTS
