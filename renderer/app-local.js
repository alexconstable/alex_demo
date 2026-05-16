import { VULNONA_EARTHWORKS } from "./vulnona-earthworks.js";

const ROUTE_DATA = {
  nodes: [
    { id: "west-coast", x: -430000, y: 120000 },
    { id: "lazy-lake", x: -341000, y: 118000 },
    { id: "west-rail", x: -278000, y: -5000 },
    { id: "gorge", x: -156000, y: -86000 },
    { id: "saltwater", x: -205000, y: -229000 },
    { id: "mudflats", x: -314000, y: -149000 },
    { id: "meadowbrush", x: -147000, y: -294000 },
    { id: "south-plains", x: -126000, y: -169000 },
    { id: "south-cross", x: 10000, y: -170000 },
    { id: "swamp", x: 81000, y: -241000 },
    { id: "delta", x: 200000, y: -56000 },
    { id: "coastal-pond", x: 330000, y: -36000 },
    { id: "east-coast", x: 430000, y: -28000 },
    { id: "jungle-pond", x: 80000, y: 10000 },
    { id: "north-cross", x: 90000, y: 76000 },
    { id: "highland-lake", x: -16000, y: 132000 },
    { id: "dam-lake", x: 76000, y: 261000 },
    { id: "cascades", x: 145000, y: 203000 },
    { id: "stonehaven", x: 246000, y: 177000 },
    { id: "verdant", x: 189000, y: 299000 },
    { id: "north-lake", x: 326000, y: 366000 },
    { id: "hushwood", x: 145000, y: 390000 },
    { id: "plains-river", x: 362000, y: 267000 },
    { id: "port", x: 477000, y: 267000 },
    { id: "east-swamp", x: 494000, y: 152000 },
    { id: "ridgewood", x: -64000, y: 344000 },
    { id: "north-ridge", x: -104000, y: 312000 }
  ],
  edges: [
    ["west-coast", "lazy-lake"],
    ["lazy-lake", "west-rail"],
    ["lazy-lake", "ridgewood"],
    ["west-rail", "gorge"],
    ["west-rail", "mudflats"],
    ["west-rail", "highland-lake"],
    ["gorge", "saltwater"],
    ["gorge", "jungle-pond"],
    ["saltwater", "mudflats"],
    ["saltwater", "meadowbrush"],
    ["saltwater", "south-plains"],
    ["mudflats", "south-plains"],
    ["meadowbrush", "swamp"],
    ["south-plains", "south-cross"],
    ["south-plains", "swamp"],
    ["south-cross", "swamp"],
    ["south-cross", "delta"],
    ["swamp", "delta"],
    ["delta", "jungle-pond"],
    ["delta", "coastal-pond"],
    ["jungle-pond", "north-cross"],
    ["jungle-pond", "highland-lake"],
    ["north-cross", "highland-lake"],
    ["north-cross", "cascades"],
    ["north-cross", "dam-lake"],
    ["highland-lake", "dam-lake"],
    ["highland-lake", "north-ridge"],
    ["north-ridge", "ridgewood"],
    ["dam-lake", "cascades"],
    ["dam-lake", "verdant"],
    ["cascades", "stonehaven"],
    ["cascades", "verdant"],
    ["stonehaven", "verdant"],
    ["stonehaven", "coastal-pond"],
    ["stonehaven", "east-swamp"],
    ["verdant", "north-lake"],
    ["north-lake", "hushwood"],
    ["north-lake", "plains-river"],
    ["plains-river", "port"],
    ["plains-river", "east-swamp"],
    ["port", "east-swamp"],
    ["coastal-pond", "east-coast"],
    ["east-coast", "east-swamp"]
  ],
  blockers: [
    [
      { x: -250000, y: 20000 },
      { x: -120000, y: -60000 },
      { x: 20000, y: 20000 },
      { x: 40000, y: 180000 },
      { x: -20000, y: 260000 },
      { x: -180000, y: 220000 }
    ],
    [
      { x: -210000, y: 250000 },
      { x: 20000, y: 250000 },
      { x: 20000, y: 450000 },
      { x: -200000, y: 450000 }
    ],
    [
      { x: 260000, y: 60000 },
      { x: 560000, y: 60000 },
      { x: 560000, y: 340000 },
      { x: 330000, y: 360000 },
      { x: 240000, y: 220000 }
    ]
  ]
};

const MAP_CONFIG = {
  imageSize: 3900,
  minX: -505000,
  maxX: 607000,
  minY: -509000,
  maxY: 607000
};

const BOSCH_TRACKER_CONFIG = {
  calibrationPoints: [
    {
      raw: { x: 268.33, y: 305.11 },
      world: { x: -118000, y: 109000 }
    },
    {
      raw: { x: 393.65, y: 192.45 },
      world: { x: 88000, y: 297000 }
    },
    {
      raw: { x: 439.69, y: 208.31 },
      world: { x: 167000, y: 255000 }
    },
    {
      raw: { x: 590.29, y: 316.56 },
      world: { x: 416000, y: 98000 }
    }
  ]
};
BOSCH_TRACKER_CONFIG.affineCalibration = buildAffineCalibration(BOSCH_TRACKER_CONFIG.calibrationPoints);

const MAP_WORLD_WIDTH = MAP_CONFIG.maxX - MAP_CONFIG.minX;
const MAP_WORLD_HEIGHT = MAP_CONFIG.maxY - MAP_CONFIG.minY;
const SCENE_SCALE_X = MAP_CONFIG.imageSize / MAP_WORLD_WIDTH;
const SCENE_SCALE_Y = MAP_CONFIG.imageSize / MAP_WORLD_HEIGHT;
const IMPORTANT_WATER_LABELS = new Set([
  "Verdant Pond",
  "Highland Lake - north",
  "Highland Lake - south",
  "Landslid Lake",
  "North Lake",
  "Dam Lake",
  "East Lake",
  "Jungle Pond",
  "Coastal Pond",
  "Delta",
  "Plains River",
  "Swamp East",
  "Swamp West",
  "South Pond"
]);
const WATER_SHAPES = [];

// Sanctuary markers are imported from Vulnona Gateway v0.21 Map Data.
  const SANCTUARY_LABELS = [
    {
      "x": 205000,
      "y": 12000,
      "text": "Delta side",
      "kind": "sanctuary"
  },
  {
    "x": 436000,
    "y": 173000,
    "text": "EastLake",
    "kind": "sanctuary"
  },
  {
    "x": -164000,
    "y": 67000,
    "text": "Highland",
    "kind": "sanctuary"
  },
  {
    "x": -329000,
    "y": -171000,
    "text": "Mudflats",
    "kind": "sanctuary"
  },
  {
    "x": -176000,
    "y": -229000,
    "text": "South Plains",
    "kind": "sanctuary"
  },
  {
    "x": 28000,
    "y": -282000,
    "text": "Swamp",
    "kind": "sanctuary"
  },
  {
    "x": 171000,
    "y": 241000,
    "text": "Verdant Forest",
    "kind": "sanctuary"
  }
];

const MIGRATION_ZONE_DEFS = [
  {
    "name": "Delta (MMZ)",
    "zoneKind": "migration",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 191.136,
        "y": -8.636
      },
      "points": [
        {
          "x": 118.0,
          "y": 78.0
        },
        {
          "x": 173.0,
          "y": 110.0
        },
        {
          "x": 251.0,
          "y": 123.0
        },
        {
          "x": 285.0,
          "y": 103.0
        },
        {
          "x": 287.0,
          "y": 82.0
        },
        {
          "x": 258.0,
          "y": 58.0
        },
        {
          "x": 218.0,
          "y": 44.0
        },
        {
          "x": 204.0,
          "y": 24.0
        },
        {
          "x": 210.0,
          "y": 4.0
        },
        {
          "x": 246.0,
          "y": -25.0
        },
        {
          "x": 279.0,
          "y": -54.0
        },
        {
          "x": 283.0,
          "y": -86.0
        },
        {
          "x": 265.0,
          "y": -117.0
        },
        {
          "x": 244.0,
          "y": -139.0
        },
        {
          "x": 214.0,
          "y": -128.0
        },
        {
          "x": 189.0,
          "y": -96.0
        },
        {
          "x": 158.0,
          "y": -87.0
        },
        {
          "x": 133.0,
          "y": -67.0
        },
        {
          "x": 112.0,
          "y": -30.0
        },
        {
          "x": 95.0,
          "y": 20.0
        },
        {
          "x": 118.0,
          "y": 78.0
        }
      ]
    },
    "id": "migration-delta-mmz-1"
  },
  {
    "name": "East Jungle",
    "zoneKind": "migration",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 336.0,
        "y": 14.0
      },
      "points": [
        {
          "x": 252.0,
          "y": 97.0
        },
        {
          "x": 420.0,
          "y": 97.0
        },
        {
          "x": 420.0,
          "y": -69.0
        },
        {
          "x": 252.0,
          "y": -69.0
        },
        {
          "x": 252.0,
          "y": 97.0
        }
      ]
    },
    "id": "migration-east-jungle-2"
  },
  {
    "name": "Highlan",
    "zoneKind": "migration",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -68.5,
        "y": 84.25
      },
      "points": [
        {
          "x": -19.0,
          "y": 162.0
        },
        {
          "x": 27.0,
          "y": 107.0
        },
        {
          "x": -120.0,
          "y": 7.0
        },
        {
          "x": -162.0,
          "y": 61.0
        },
        {
          "x": -19.0,
          "y": 162.0
        }
      ]
    },
    "id": "migration-highlan-3"
  },
  {
    "name": "Mudflats",
    "zoneKind": "migration",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -291.0,
        "y": -155.0
      },
      "width": 140.0,
      "height": 134.0,
      "rotation": -5.0
    },
    "id": "migration-mudflats-4"
  },
  {
    "name": "North Lake (MMZ)",
    "zoneKind": "migration",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 354.0,
        "y": 358.0
      },
      "width": 170.0,
      "height": 178.0,
      "rotation": 35.0
    },
    "id": "migration-north-lake-mmz-5"
  },
  {
    "name": "Northern Jungle",
    "zoneKind": "migration",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 180.0,
        "y": 336.0
      },
      "width": 130.0,
      "height": 100.0,
      "rotation": -13.0
    },
    "id": "migration-northern-jungle-6"
  },
  {
    "name": "South Plains (MMZ)",
    "zoneKind": "migration",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -290.429,
        "y": -253.5
      },
      "points": [
        {
          "x": -370.0,
          "y": -200.0
        },
        {
          "x": -346.0,
          "y": -187.0
        },
        {
          "x": -320.0,
          "y": -185.0
        },
        {
          "x": -307.0,
          "y": -207.0
        },
        {
          "x": -298.0,
          "y": -230.0
        },
        {
          "x": -276.0,
          "y": -242.0
        },
        {
          "x": -251.0,
          "y": -236.0
        },
        {
          "x": -231.0,
          "y": -252.0
        },
        {
          "x": -215.0,
          "y": -296.0
        },
        {
          "x": -203.0,
          "y": -350.0
        },
        {
          "x": -219.0,
          "y": -364.0
        },
        {
          "x": -316.0,
          "y": -304.0
        },
        {
          "x": -344.0,
          "y": -270.0
        },
        {
          "x": -370.0,
          "y": -226.0
        },
        {
          "x": -370.0,
          "y": -200.0
        }
      ]
    },
    "id": "migration-south-plains-mmz-7"
  },
  {
    "name": "Swamp",
    "zoneKind": "migration",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 55.0,
        "y": -294.0
      },
      "points": [
        {
          "x": -30.0,
          "y": -227.0
        },
        {
          "x": 140.0,
          "y": -227.0
        },
        {
          "x": 140.0,
          "y": -361.0
        },
        {
          "x": -30.0,
          "y": -361.0
        },
        {
          "x": -30.0,
          "y": -227.0
        }
      ]
    },
    "id": "migration-swamp-8"
  },
  {
    "name": "Tide Beach",
    "zoneKind": "migration",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 450.0,
        "y": 40.0
      },
      "width": 120.0,
      "height": 120.0,
      "rotation": -0.0
    },
    "id": "migration-tide-beach-9"
  },
  {
    "name": "West Rail Access",
    "zoneKind": "migration",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -231.0,
        "y": -27.0
      },
      "width": 156.0,
      "height": 172.0,
      "rotation": -19.0
    },
    "id": "migration-west-rail-access-10"
  },
  {
    "name": "Center Jungle",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 57.75,
        "y": 79.0
      },
      "points": [
        {
          "x": 46.0,
          "y": 104.0
        },
        {
          "x": 69.0,
          "y": 104.0
        },
        {
          "x": 69.0,
          "y": 54.0
        },
        {
          "x": 47.0,
          "y": 54.0
        },
        {
          "x": 46.0,
          "y": 104.0
        }
      ]
    },
    "id": "patrol-center-jungle-11"
  },
  {
    "name": "Delta",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 174.0,
        "y": 44.0
      },
      "width": 50.0,
      "height": 28.0,
      "rotation": -46.0
    },
    "id": "patrol-delta-12"
  },
  {
    "name": "Delta",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 127.0,
        "y": 16.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-delta-13"
  },
  {
    "name": "Delta",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 206.0,
        "y": -79.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-delta-14"
  },
  {
    "name": "Delta",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 175.5,
        "y": -13.5
      },
      "points": [
        {
          "x": 163.0,
          "y": 5.0
        },
        {
          "x": 185.0,
          "y": 6.0
        },
        {
          "x": 188.0,
          "y": -32.0
        },
        {
          "x": 166.0,
          "y": -33.0
        },
        {
          "x": 163.0,
          "y": 5.0
        }
      ]
    },
    "id": "patrol-delta-15"
  },
  {
    "name": "Delta",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 218.75,
        "y": -31.5
      },
      "points": [
        {
          "x": 186.0,
          "y": -21.0
        },
        {
          "x": 196.0,
          "y": -7.0
        },
        {
          "x": 251.0,
          "y": -42.0
        },
        {
          "x": 242.0,
          "y": -56.0
        },
        {
          "x": 186.0,
          "y": -21.0
        }
      ]
    },
    "id": "patrol-delta-16"
  },
  {
    "name": "Delta River",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 295.5,
        "y": 107.0
      },
      "points": [
        {
          "x": 301.0,
          "y": 128.0
        },
        {
          "x": 318.0,
          "y": 110.0
        },
        {
          "x": 290.0,
          "y": 86.0
        },
        {
          "x": 273.0,
          "y": 104.0
        },
        {
          "x": 301.0,
          "y": 128.0
        }
      ]
    },
    "id": "patrol-delta-river-17"
  },
  {
    "name": "East Coast",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 541.0,
        "y": 155.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-east-coast-18"
  },
  {
    "name": "East Coast",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 503.0,
        "y": 90.0
      },
      "width": 56.0,
      "height": 50.0,
      "rotation": 0
    },
    "id": "patrol-east-coast-19"
  },
  {
    "name": "Endorheic",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 196.0,
        "y": -191.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": -0.0
    },
    "id": "patrol-endorheic-20"
  },
  {
    "name": "Fork Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 275.5,
        "y": 179.5
      },
      "points": [
        {
          "x": 254.0,
          "y": 200.0
        },
        {
          "x": 297.0,
          "y": 200.0
        },
        {
          "x": 297.0,
          "y": 159.0
        },
        {
          "x": 254.0,
          "y": 159.0
        },
        {
          "x": 254.0,
          "y": 200.0
        }
      ]
    },
    "id": "patrol-fork-plains-21"
  },
  {
    "name": "Fork Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 208.6,
        "y": 87.6
      },
      "points": [
        {
          "x": 191.0,
          "y": 119.0
        },
        {
          "x": 222.0,
          "y": 119.0
        },
        {
          "x": 223.0,
          "y": 70.0
        },
        {
          "x": 214.0,
          "y": 66.0
        },
        {
          "x": 193.0,
          "y": 64.0
        },
        {
          "x": 191.0,
          "y": 119.0
        }
      ]
    },
    "id": "patrol-fork-plains-22"
  },
  {
    "name": "Highlands",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -7.0,
        "y": 163.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-highlands-23"
  },
  {
    "name": "Highlands",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -52.25,
        "y": 165.75
      },
      "points": [
        {
          "x": -53.0,
          "y": 182.0
        },
        {
          "x": -36.0,
          "y": 162.0
        },
        {
          "x": -51.0,
          "y": 149.0
        },
        {
          "x": -69.0,
          "y": 170.0
        },
        {
          "x": -53.0,
          "y": 182.0
        }
      ]
    },
    "id": "patrol-highlands-24"
  },
  {
    "name": "Highlands",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -112.0,
        "y": 142.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-highlands-25"
  },
  {
    "name": "Highlands",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -132.0,
        "y": 52.0
      },
      "width": 26.0,
      "height": 26.0,
      "rotation": 0
    },
    "id": "patrol-highlands-26"
  },
  {
    "name": "Mudflats",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -295.0,
        "y": -146.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": -0.0
    },
    "id": "patrol-mudflats-27"
  },
  {
    "name": "NE Cape",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 436.75,
        "y": 465.25
      },
      "points": [
        {
          "x": 436.0,
          "y": 515.0
        },
        {
          "x": 463.0,
          "y": 508.0
        },
        {
          "x": 438.0,
          "y": 414.0
        },
        {
          "x": 410.0,
          "y": 424.0
        },
        {
          "x": 436.0,
          "y": 515.0
        }
      ]
    },
    "id": "patrol-ne-cape-28"
  },
  {
    "name": "NE Cape",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 418.0,
        "y": 475.0
      },
      "width": 40.0,
      "height": 40.0,
      "rotation": 0
    },
    "id": "patrol-ne-cape-29"
  },
  {
    "name": "NE Cape",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 457.0,
        "y": 432.0
      },
      "width": 44.0,
      "height": 44.0,
      "rotation": 0
    },
    "id": "patrol-ne-cape-30"
  },
  {
    "name": "North Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 345.0,
        "y": 344.0
      },
      "width": 24.0,
      "height": 24.0,
      "rotation": 0
    },
    "id": "patrol-north-plains-31"
  },
  {
    "name": "North Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 288.0,
        "y": 459.0
      },
      "width": 24.0,
      "height": 22.0,
      "rotation": 0
    },
    "id": "patrol-north-plains-32"
  },
  {
    "name": "North Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 261.8,
        "y": 408.8
      },
      "points": [
        {
          "x": 237.0,
          "y": 430.0
        },
        {
          "x": 280.0,
          "y": 430.0
        },
        {
          "x": 281.0,
          "y": 398.0
        },
        {
          "x": 274.0,
          "y": 393.0
        },
        {
          "x": 237.0,
          "y": 393.0
        },
        {
          "x": 237.0,
          "y": 430.0
        }
      ]
    },
    "id": "patrol-north-plains-33"
  },
  {
    "name": "Northern Jungle",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 126.5,
        "y": 330.0
      },
      "points": [
        {
          "x": 106.0,
          "y": 349.0
        },
        {
          "x": 147.0,
          "y": 349.0
        },
        {
          "x": 147.0,
          "y": 311.0
        },
        {
          "x": 106.0,
          "y": 311.0
        },
        {
          "x": 106.0,
          "y": 349.0
        }
      ]
    },
    "id": "patrol-northern-jungle-34"
  },
  {
    "name": "Northern Jungle",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 128.5,
        "y": 284.0
      },
      "points": [
        {
          "x": 108.0,
          "y": 304.0
        },
        {
          "x": 149.0,
          "y": 304.0
        },
        {
          "x": 149.0,
          "y": 264.0
        },
        {
          "x": 108.0,
          "y": 264.0
        },
        {
          "x": 108.0,
          "y": 304.0
        }
      ]
    },
    "id": "patrol-northern-jungle-35"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -370.0,
        "y": -183.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-pits-36"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -349.0,
        "y": -211.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-pits-37"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -318.0,
        "y": -235.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-pits-38"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -261.0,
        "y": -258.0
      },
      "width": 40.0,
      "height": 40.0,
      "rotation": 0
    },
    "id": "patrol-pits-39"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -280.0,
        "y": -287.0
      },
      "width": 28.0,
      "height": 28.0,
      "rotation": 0
    },
    "id": "patrol-pits-40"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -228.0,
        "y": -285.0
      },
      "width": 38.0,
      "height": 38.0,
      "rotation": 0
    },
    "id": "patrol-pits-41"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -251.0,
        "y": -348.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-pits-42"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -236.0,
        "y": -396.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-pits-43"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -292.0,
        "y": -343.0
      },
      "width": 28.0,
      "height": 36.0,
      "rotation": 0
    },
    "id": "patrol-pits-44"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -362.0,
        "y": -367.0
      },
      "width": 38.0,
      "height": 38.0,
      "rotation": 0
    },
    "id": "patrol-pits-45"
  },
  {
    "name": "Pits",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -443.0,
        "y": -318.0
      },
      "width": 42.0,
      "height": 42.0,
      "rotation": 0
    },
    "id": "patrol-pits-46"
  },
  {
    "name": "Port hill",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 444.0,
        "y": 292.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": -0.0
    },
    "id": "patrol-port-hill-47"
  },
  {
    "name": "Radio Tower",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 529.0,
        "y": 204.0
      },
      "width": 34.0,
      "height": 34.0,
      "rotation": -0.0
    },
    "id": "patrol-radio-tower-48"
  },
  {
    "name": "Sandbank Bay",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 404.0,
        "y": 1.25
      },
      "points": [
        {
          "x": 378.0,
          "y": 18.0
        },
        {
          "x": 434.0,
          "y": 2.0
        },
        {
          "x": 430.0,
          "y": -15.0
        },
        {
          "x": 374.0,
          "y": -0.0
        },
        {
          "x": 378.0,
          "y": 18.0
        }
      ]
    },
    "id": "patrol-sandbank-bay-49"
  },
  {
    "name": "Sandbank Bay",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 346.0,
        "y": -8.0
      },
      "points": [
        {
          "x": 332.0,
          "y": 20.0
        },
        {
          "x": 351.0,
          "y": 23.0
        },
        {
          "x": 360.0,
          "y": -36.0
        },
        {
          "x": 341.0,
          "y": -39.0
        },
        {
          "x": 332.0,
          "y": 20.0
        }
      ]
    },
    "id": "patrol-sandbank-bay-50"
  },
  {
    "name": "Sandbank Bay",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 328.0,
        "y": -62.25
      },
      "points": [
        {
          "x": 337.0,
          "y": -30.0
        },
        {
          "x": 354.0,
          "y": -42.0
        },
        {
          "x": 319.0,
          "y": -95.0
        },
        {
          "x": 302.0,
          "y": -82.0
        },
        {
          "x": 337.0,
          "y": -30.0
        }
      ]
    },
    "id": "patrol-sandbank-bay-51"
  },
  {
    "name": "South Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -252.0,
        "y": -153.0
      },
      "width": 38.0,
      "height": 38.0,
      "rotation": 0
    },
    "id": "patrol-south-plains-52"
  },
  {
    "name": "South Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -154.0,
        "y": -175.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-south-plains-53"
  },
  {
    "name": "South Plains",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -187.0,
        "y": -267.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-south-plains-54"
  },
  {
    "name": "Southern Beach",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -101.0,
        "y": -303.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-southern-beach-55"
  },
  {
    "name": "Southern Beach",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 9.5,
        "y": -363.0
      },
      "points": [
        {
          "x": 3.0,
          "y": -334.0
        },
        {
          "x": 40.0,
          "y": -369.0
        },
        {
          "x": 16.0,
          "y": -392.0
        },
        {
          "x": -21.0,
          "y": -357.0
        },
        {
          "x": 3.0,
          "y": -334.0
        }
      ]
    },
    "id": "patrol-southern-beach-56"
  },
  {
    "name": "Southern Beach",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -36.25,
        "y": -386.5
      },
      "points": [
        {
          "x": -63.0,
          "y": -345.0
        },
        {
          "x": 12.0,
          "y": -403.0
        },
        {
          "x": -10.0,
          "y": -429.0
        },
        {
          "x": -84.0,
          "y": -369.0
        },
        {
          "x": -63.0,
          "y": -345.0
        }
      ]
    },
    "id": "patrol-southern-beach-57"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 124.0,
        "y": -188.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-swamps-58"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 139.0,
        "y": -233.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-swamps-59"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 109.0,
        "y": -285.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-swamps-60"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 158.0,
        "y": -336.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-swamps-61"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 53.0,
        "y": -341.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-swamps-62"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 139.0,
        "y": -209.8
      },
      "points": [
        {
          "x": 125.0,
          "y": -189.0
        },
        {
          "x": 161.0,
          "y": -189.0
        },
        {
          "x": 161.0,
          "y": -241.0
        },
        {
          "x": 124.0,
          "y": -241.0
        },
        {
          "x": 124.0,
          "y": -189.0
        },
        {
          "x": 125.0,
          "y": -189.0
        }
      ]
    },
    "id": "patrol-swamps-63"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": 57.0,
        "y": -234.5
      },
      "points": [
        {
          "x": 40.0,
          "y": -208.0
        },
        {
          "x": 74.0,
          "y": -208.0
        },
        {
          "x": 74.0,
          "y": -261.0
        },
        {
          "x": 40.0,
          "y": -261.0
        },
        {
          "x": 40.0,
          "y": -208.0
        }
      ]
    },
    "id": "patrol-swamps-64"
  },
  {
    "name": "Swamps",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -14.5,
        "y": -309.0
      },
      "points": [
        {
          "x": -39.0,
          "y": -292.0
        },
        {
          "x": 10.0,
          "y": -292.0
        },
        {
          "x": 10.0,
          "y": -326.0
        },
        {
          "x": -39.0,
          "y": -326.0
        },
        {
          "x": -39.0,
          "y": -292.0
        }
      ]
    },
    "id": "patrol-swamps-65"
  },
  {
    "name": "Tide Pool",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 453.0,
        "y": 51.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": -0.0
    },
    "id": "patrol-tide-pool-66"
  },
  {
    "name": "West Rail",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -323.0,
        "y": -23.0
      },
      "width": 38.0,
      "height": 38.0,
      "rotation": 0
    },
    "id": "patrol-west-rail-67"
  },
  {
    "name": "West Rail",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -289.0,
        "y": 13.0
      },
      "width": 36.0,
      "height": 36.0,
      "rotation": 0
    },
    "id": "patrol-west-rail-68"
  },
  {
    "name": "West Rail",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -249.0,
        "y": -26.0
      },
      "width": 30.0,
      "height": 30.0,
      "rotation": 0
    },
    "id": "patrol-west-rail-69"
  },
  {
    "name": "West Rail",
    "zoneKind": "patrol",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -227.0,
        "y": -4.0
      },
      "width": 40.0,
      "height": 40.0,
      "rotation": 0
    },
    "id": "patrol-west-rail-70"
  },
  {
    "name": "West Rail",
    "zoneKind": "patrol",
    "shape": {
      "kind": "polygon",
      "center": {
        "x": -365.0,
        "y": 25.0
      },
      "points": [
        {
          "x": -385.0,
          "y": 65.0
        },
        {
          "x": -345.0,
          "y": 65.0
        },
        {
          "x": -345.0,
          "y": -15.0
        },
        {
          "x": -385.0,
          "y": -15.0
        },
        {
          "x": -385.0,
          "y": 65.0
        }
      ]
    },
    "id": "patrol-west-rail-71"
  },
  {
    "name": "Delta side",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
        "center": {
          "x": 205.0,
          "y": 12.0
        },
        "width": 28.0,
        "height": 28.0,
      "rotation": -0.0
    },
    "id": "sanctuary-delta-side-72"
  },
  {
    "name": "EastLake",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 436.0,
        "y": 173.0
      },
      "width": 22.0,
      "height": 16.0,
      "rotation": 9.0
    },
    "id": "sanctuary-eastlake-73"
  },
  {
    "name": "Highland 1",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -164.0,
        "y": 67.0
      },
      "width": 12.0,
      "height": 30.0,
      "rotation": 10.0
    },
    "id": "sanctuary-highland-74"
  },
  {
    "name": "Highland 2",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -172.0,
        "y": 45.0
      },
      "width": 12.0,
      "height": 20.0,
      "rotation": 20.0
    },
    "id": "sanctuary-highland-75"
  },
  {
    "name": "Mudflats",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -329.0,
        "y": -171.0
      },
      "width": 16.0,
      "height": 20.0,
      "rotation": -0.0
    },
    "id": "sanctuary-mudflats-76"
  },
  {
    "name": "South Plains",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": -176.0,
        "y": -229.0
      },
      "width": 20.0,
      "height": 14.0,
      "rotation": 20.0
    },
    "id": "sanctuary-south-plains-77"
  },
  {
    "name": "Swamp",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 28.0,
        "y": -282.0
      },
      "width": 16.0,
      "height": 20.0,
      "rotation": -16.0
    },
    "id": "sanctuary-swamp-78"
  },
  {
    "name": "Verdant Forest",
    "zoneKind": "sanctuary",
    "shape": {
      "kind": "ellipse",
      "center": {
        "x": 171.0,
        "y": 241.0
      },
      "width": 16.0,
      "height": 16.0,
      "rotation": -0.0
    },
    "id": "sanctuary-verdant-forest-79"
  }
];

const MIGRATION_ZONES = MIGRATION_ZONE_DEFS.map(normalizeMigrationZone);

const MAP_LABELS = [
  {
    "x": 177000,
    "y": -33000,
    "text": "Delta",
    "kind": "region"
  },
  {
    "x": 538000,
    "y": 97000,
    "text": "East Coast",
    "kind": "region"
  },
  {
    "x": 416000,
    "y": 136000,
    "text": "Eastern Lake",
    "kind": "region"
  },
  {
    "x": 246000,
    "y": 119000,
    "text": "Forks Plains",
    "kind": "region"
  },
  {
    "x": -71000,
    "y": 61000,
    "text": "Highland",
    "kind": "region"
  },
  {
    "x": 125000,
    "y": 96000,
    "text": "Jungle I sec.",
    "kind": "region"
  },
  {
    "x": -322000,
    "y": -109000,
    "text": "Mudflats",
    "kind": "region"
  },
  {
    "x": 433000,
    "y": 460000,
    "text": "NE Cape",
    "kind": "region"
  },
  {
    "x": 353000,
    "y": 345000,
    "text": "North Plains",
    "kind": "region"
  },
  {
    "x": 148000,
    "y": 336000,
    "text": "Northern Jungle",
    "kind": "region"
  },
  {
    "x": -156000,
    "y": 257000,
    "text": "NW. Ridge",
    "kind": "region"
  },
  {
    "x": 545000,
    "y": 300000,
    "text": "Port",
    "kind": "region"
  },
  {
    "x": -182000,
    "y": -185000,
    "text": "South Plains",
    "kind": "region"
  },
  {
    "x": 112000,
    "y": -409000,
    "text": "Southern Beach - east",
    "kind": "region"
  },
  {
    "x": -53000,
    "y": -406000,
    "text": "Southern Beach - west",
    "kind": "region"
  },
  {
    "x": 51000,
    "y": -302000,
    "text": "Swamps",
    "kind": "region"
  },
  {
    "x": -355000,
    "y": -311000,
    "text": "The Pit",
    "kind": "region"
  },
  {
    "x": 455000,
    "y": 36000,
    "text": "Tide Pool",
    "kind": "region"
  },
  {
    "x": -238000,
    "y": 4000,
    "text": "West Rail",
    "kind": "region"
  },
  {
    "x": 87000,
    "y": 214000,
    "text": "Water Access",
    "kind": "region"
  },
  {
    "x": 152000,
    "y": 175000,
    "text": "Cascades",
    "kind": "water"
  },
  {
    "x": 330000,
    "y": -50000,
    "text": "Coastal Pond",
    "kind": "water"
  },
  {
    "x": 79000,
    "y": 267000,
    "text": "Dam Lake",
    "kind": "water"
  },
  {
    "x": 189000,
    "y": -43000,
    "text": "Delta",
    "kind": "water"
  },
  {
    "x": 254000,
    "y": 84000,
    "text": "Delta River",
    "kind": "water"
  },
  {
    "x": 460000,
    "y": 137000,
    "text": "East Lake",
    "kind": "water"
  },
  {
    "x": 238000,
    "y": 179000,
    "text": "Forks Pond",
    "kind": "water"
  },
  {
    "x": -198000,
    "y": -135000,
    "text": "Gorge River",
    "kind": "water"
  },
  {
    "x": -22000,
    "y": 135000,
    "text": "Highland Lake - north",
    "kind": "water"
  },
  {
    "x": -65000,
    "y": 92000,
    "text": "Highland Lake - south",
    "kind": "water"
  },
  {
    "x": 344000,
    "y": 171000,
    "text": "Hollow Falls",
    "kind": "water"
  },
  {
    "x": 82000,
    "y": 2000,
    "text": "Jungle Pond",
    "kind": "water"
  },
  {
    "x": -226000,
    "y": 80000,
    "text": "Landslid Lake",
    "kind": "water"
  },
  {
    "x": 324000,
    "y": 374000,
    "text": "North Lake",
    "kind": "water"
  },
  {
    "x": -332000,
    "y": -281000,
    "text": "Pit Pond",
    "kind": "water"
  },
  {
    "x": 368000,
    "y": 290000,
    "text": "Plains River",
    "kind": "water"
  },
  {
    "x": -244000,
    "y": -82000,
    "text": "Pygmy's puddle (temp)",
    "kind": "water"
  },
  {
    "x": -252000,
    "y": -319000,
    "text": "Rock Pond",
    "kind": "water"
  },
  {
    "x": 179000,
    "y": -199000,
    "text": "Endorheic",
    "kind": "water"
  },
  {
    "x": -149000,
    "y": -309000,
    "text": "South Pond",
    "kind": "water"
  },
  {
    "x": -352000,
    "y": -200000,
    "text": "South Puddle",
    "kind": "water"
  },
  {
    "x": 106000,
    "y": -254000,
    "text": "Swamp East",
    "kind": "water"
  },
  {
    "x": -30000,
    "y": -276000,
    "text": "Swamp West",
    "kind": "water"
  },
  {
    "x": 167000,
    "y": 255000,
    "text": "Verdant Pond",
    "kind": "water"
  },
  {
    "x": 285000,
    "y": 258000,
    "text": "Volcano Cave",
    "kind": "water"
  },
  {
    "x": 256000,
    "y": 283000,
    "text": "Volcano Chamber",
    "kind": "water"
  },
  {
    "x": -277000,
    "y": -20000,
    "text": "West Pond",
    "kind": "water"
  },
  {
    "x": -128000,
    "y": -90000,
    "text": "Shade puddle (temp)",
    "kind": "water"
  },
  {
    "x": -43000,
    "y": -104000,
    "text": "Central Dome (Hexagon)",
    "kind": "structure"
  },
  {
    "x": -41000,
    "y": -120000,
    "text": ":Central Dome:comment",
    "kind": "structure"
  },
  {
    "x": 66000,
    "y": 293000,
    "text": "Dam",
    "kind": "structure"
  },
  {
    "x": 240000,
    "y": -141000,
    "text": "Estuary Weir",
    "kind": "structure"
  },
  {
    "x": 10000,
    "y": 199000,
    "text": "Highland Bridge",
    "kind": "structure"
  },
  {
    "x": -204000,
    "y": -237000,
    "text": "Lagoon",
    "kind": "structure"
  },
  {
    "x": 360000,
    "y": 221000,
    "text": "Log Bridge",
    "kind": "structure"
  },
  {
    "x": 236000,
    "y": 53000,
    "text": "Mad Grotto",
    "kind": "structure"
  },
  {
    "x": 47000,
    "y": -191000,
    "text": "Pipes",
    "kind": "structure"
  },
  {
    "x": -431000,
    "y": -310000,
    "text": "Pit's Antenna",
    "kind": "structure"
  },
  {
    "x": 533000,
    "y": 240000,
    "text": "Port Tunnel",
    "kind": "structure"
  },
  {
    "x": 545000,
    "y": 224000,
    "text": "Radio Tower",
    "kind": "structure"
  },
  {
    "x": 215000,
    "y": -270000,
    "text": "Shallows",
    "kind": "structure"
  },
  {
    "x": 118000,
    "y": -138000,
    "text": "Swamp Tunnel",
    "kind": "structure"
  },
  {
    "x": 250000,
    "y": 268000,
    "text": "Volcano (Extinct)",
    "kind": "structure"
  },
  {
    "x": 197000,
    "y": 425000,
    "text": "Site C14 - Derelict Base",
    "kind": "structure"
  },
  {
    "x": 237000,
    "y": 326000,
    "text": "Site E15 - Volcano Notrh",
    "kind": "structure"
  },
  {
    "x": 46000,
    "y": 242000,
    "text": "Site F11 - Lakeport",
    "kind": "structure"
  },
  {
    "x": 337000,
    "y": 242000,
    "text": "Site F16 - Volcano East",
    "kind": "structure"
  },
  {
    "x": 282000,
    "y": 228000,
    "text": "Site G15 - Volcano South",
    "kind": "structure"
  },
  {
    "x": 529000,
    "y": 218000,
    "text": "Site G20 - Radio Base",
    "kind": "structure"
  },
  {
    "x": 483000,
    "y": 200000,
    "text": "Storage H19",
    "kind": "structure"
  },
  {
    "x": 81000,
    "y": 109000,
    "text": "Site I12 - RS",
    "kind": "structure"
  },
  {
    "x": 253000,
    "y": -18000,
    "text": "Site K15 - Delta side",
    "kind": "structure"
  },
  {
    "x": 45000,
    "y": -112000,
    "text": "Site L11 - Hex's Entrance",
    "kind": "structure"
  },
  {
    "x": 293000,
    "y": 40000,
    "text": "Gate J16",
    "kind": "structure"
  },
  {
    "x": 272000,
    "y": -5000,
    "text": "Gate K15",
    "kind": "structure"
  },
  {
    "x": 272000,
    "y": -63000,
    "text": "Gate L15",
    "kind": "structure"
  },
  {
    "x": 70000,
    "y": -67000,
    "text": "Gate L12",
    "kind": "structure"
  },
  {
    "x": 77000,
    "y": -24000,
    "text": "Gate K12",
    "kind": "structure"
  },
  {
    "x": 388000,
    "y": 242000,
    "text": "Collapsed point F17",
    "kind": "structure"
  },
  {
    "x": 405000,
    "y": 207000,
    "text": "Gate G17",
    "kind": "structure"
  },
  {
    "x": 454000,
    "y": 192000,
    "text": "Collapsed point G18",
    "kind": "structure"
  },
  {
    "x": 505000,
    "y": 197000,
    "text": "Collapsed point G19",
    "kind": "structure"
  },
  {
    "x": 504000,
    "y": 161000,
    "text": "Gate H19",
    "kind": "structure"
  },
  {
    "x": 439000,
    "y": 85000,
    "text": "Gate G20",
    "kind": "structure"
  },
  {
    "x": 305000,
    "y": 164000,
    "text": "Gate H16",
    "kind": "structure"
  },
  {
    "x": 216000,
    "y": 377000,
    "text": "Gate D14",
    "kind": "structure"
  },
  {
    "x": 233000,
    "y": 428000,
    "text": "Gate C14",
    "kind": "structure"
  },
  {
    "x": 260000,
    "y": 448000,
    "text": "Gate C15",
    "kind": "structure"
  },
  {
    "x": 320000,
    "y": 423000,
    "text": "Collapsed point C16",
    "kind": "structure"
  },
  {
    "x": 357000,
    "y": 414000,
    "text": "Gate C17",
    "kind": "structure"
  },
  {
    "x": 405000,
    "y": 404000,
    "text": "Collapsed point D17",
    "kind": "structure"
  },
  {
    "x": 410000,
    "y": 370000,
    "text": "Gate D18",
    "kind": "structure"
  },
  {
    "x": 395000,
    "y": 316000,
    "text": "Collapsed point E17",
    "kind": "structure"
  },
  {
    "x": 405000,
    "y": 258000,
    "text": "Gate F17",
    "kind": "structure"
  },
    {
      "x": 205000,
      "y": 12000,
      "text": "Delta side",
      "kind": "sanctuary"
  },
  {
    "x": 436000,
    "y": 173000,
    "text": "EastLake",
    "kind": "sanctuary"
  },
  {
    "x": -164000,
    "y": 67000,
    "text": "Highland",
    "kind": "sanctuary"
  },
  {
    "x": -329000,
    "y": -171000,
    "text": "Mudflats",
    "kind": "sanctuary"
  },
  {
    "x": -176000,
    "y": -229000,
    "text": "South Plains",
    "kind": "sanctuary"
  },
  {
    "x": 28000,
    "y": -282000,
    "text": "Swamp",
    "kind": "sanctuary"
  },
  {
    "x": 171000,
    "y": 241000,
    "text": "Verdant Forest",
    "kind": "sanctuary"
  }
];

const routeGraph = buildRouteGraph();
const mapCenter = {
  x: (MAP_CONFIG.minX + MAP_CONFIG.maxX) / 2,
  y: (MAP_CONFIG.minY + MAP_CONFIG.maxY) / 2
};
const PARTY_POLL_INTERVAL_MS = 3000;
const PARTY_SESSION_KEY = "the-isle-bosch-overlay.party-session";
const PARTY_COLOR_PALETTE = ["#7dd3fc", "#f472b6", "#f59e0b", "#34d399", "#a78bfa", "#fb7185", "#facc15", "#38bdf8"];
const TRACKER_ZONE_SNAP_MARGIN = 18000;
const BOSCH_LOGIN_TRACKER_RELOAD_MS = 4500;
let boschLoginTrackerReloadTimer = null;

const elements = {
  body: document.body,
  mapMudImage: document.getElementById("map-mud-image"),
  mapView: document.getElementById("map-view"),
  mapScene: document.getElementById("map-scene"),
  waterShapes: document.getElementById("water-shapes"),
  migrationZoneShapes: document.getElementById("migration-zone-shapes"),
  sanctuaryMarkers: document.getElementById("sanctuary-markers"),
  migrationZoneMarkers: document.getElementById("migration-zone-markers"),
  zoneToggleButtons: document.querySelectorAll("[data-layer-toggle]"),
  resourceToggleButtons: document.querySelectorAll("[data-resource-toggle]"),
  mapLabelLayer: document.getElementById("map-label-layer"),
  resourceMarkerLayer: document.getElementById("resource-marker-layer"),
  partyMarkerLayer: document.getElementById("party-marker-layer"),
  routeShadow: document.getElementById("route-shadow"),
  routeLine: document.getElementById("route-line"),
  routePlayerCone: document.getElementById("route-player-cone"),
  routePlayerConeGradient: document.getElementById("route-player-cone-gradient"),
  routePlayer: document.getElementById("route-player"),
  routePin: document.getElementById("route-pin"),
  mapCompassPointer: document.getElementById("map-compass-pointer"),
  mapCompassDial: document.getElementById("map-compass-dial"),
  boschView: document.getElementById("bosch-view"),
  boschSheet: document.getElementById("bosch-sheet"),
  closeBoschSheet: document.getElementById("close-bosch-sheet"),
  boschHomeButton: document.getElementById("bosch-home-button"),
  boschTrackerButton: document.getElementById("bosch-tracker-button"),
  boschBackButton: document.getElementById("bosch-back-button"),
  boschReloadButton: document.getElementById("bosch-reload-button"),
  connectBoschButton: document.getElementById("connect-bosch-button"),
  reloadBoschButton: document.getElementById("reload-bosch-button"),
  hideOverlayButton: document.getElementById("hide-overlay-button"),
  quitOverlayButton: document.getElementById("quit-overlay-button"),
  toggleModeButton: document.getElementById("toggle-mode-button"),
  hotkeyLabel: document.getElementById("hotkey-label"),
  connectionLabel: document.getElementById("connection-label"),
  helperCopy: document.getElementById("helper-copy"),
  modeDot: document.getElementById("mode-dot"),
  statusValue: document.getElementById("status-value"),
  updatedValue: document.getElementById("updated-value"),
  serverValue: document.getElementById("server-value"),
  zoneValue: document.getElementById("zone-value"),
  mapXValue: document.getElementById("map-x-value"),
  mapYValue: document.getElementById("map-y-value"),
  altitudeValue: document.getElementById("altitude-value"),
  partyIdentityForm: document.getElementById("party-identity-form"),
  partyNameInput: document.getElementById("party-name-input"),
  partyRoomForm: document.getElementById("party-room-form"),
  partyRoomInput: document.getElementById("party-room-input"),
  partyJoinButton: document.getElementById("party-join-button"),
  partyLeaveButton: document.getElementById("party-leave-button"),
  partyRoomActive: document.getElementById("party-room-active"),
  partyFeedback: document.getElementById("party-feedback"),
  partyMemberList: document.getElementById("party-member-list"),
  coordsForm: document.getElementById("coords-form"),
  coordsInput: document.getElementById("coords-input"),
  clearCoordsButton: document.getElementById("clear-coords-button"),
  coordsFeedback: document.getElementById("coords-feedback")
};

const state = {
  overlayMode: "compact",
  lastSnapshot: null,
  currentPosition: null,
  playerHeadingRadians: -Math.PI / 2,
  pinnedPosition: null,
  expandedZoom: 1,
  expandedPan: {
    x: 0,
    y: 0
  },
  dragState: {
    active: false,
    suppressClick: false,
    startClientX: 0,
    startClientY: 0,
    startPanX: 0,
    startPanY: 0
  },
  mapTransform: {
    scale: 1,
    x: 0,
    y: 0
  },
  zoneVisibility: {
    migration: true,
    patrol: true,
    sanctuary: true
  },
  resourceVisibility: {
    gastro: false,
    saltRock: false,
    mudPool: false
  },
  party: {
    roomCode: null,
    playerId: null,
    playerName: "",
    color: null,
    members: [],
    lastSharedKey: null,
    lastSharedAt: 0
  },
  partyTimer: null,
  boschTrackerUrl: "https://bosch-island.com/map-tracker",
  boschHomeUrl: "https://bosch-island.com/"
};

init().catch((error) => {
  console.error(error);
  elements.statusValue.textContent = "Error";
  elements.helperCopy.textContent = error instanceof Error ? error.message : String(error);
});

async function init() {
  hydratePartySession();
  await configureBoschView();
  wireButtons();
  wireOverlayBridge();
  wireMapView();
  wireBoschView();
  updateModeUi("compact");
  renderMap();
  updatePartyUi();

  if (state.party.roomCode) {
    try {
      await refreshPartyState({ quiet: true });
    } catch (error) {
      console.error(error);
      elements.partyFeedback.textContent =
        "Saved room could not be reached yet. You can still rejoin once the room service is available.";
    }
    startPartyPolling();
  }
}

async function configureBoschView() {
  const fallbackTrackerUrl = "https://bosch-island.com/map-tracker";

  try {
    const resources = await window.isleOverlay.getResources();
    if (resources?.boschPreloadUrl) {
      elements.boschView.setAttribute("preload", resources.boschPreloadUrl);
    }

    state.boschTrackerUrl = resources?.boschTrackerUrl || fallbackTrackerUrl;
    state.boschHomeUrl = resources?.boschHomeUrl || "https://bosch-island.com/";
    elements.boschView.setAttribute("src", state.boschTrackerUrl);
  } catch (error) {
    console.error("Failed to configure Bosch webview resources", error);
    state.boschTrackerUrl = fallbackTrackerUrl;
    elements.boschView.setAttribute("src", fallbackTrackerUrl);
  }
}

function setBoschLoginZoom() {
  if (typeof elements.boschView.setZoomFactor === "function") {
    elements.boschView.setZoomFactor(0.86);
  }
}

function startBoschLoginTrackingWatch() {
  stopBoschLoginTrackingWatch();
  elements.boschView.loadURL(state.boschTrackerUrl);
  boschLoginTrackerReloadTimer = window.setInterval(() => {
    elements.boschView.loadURL(state.boschTrackerUrl);
  }, BOSCH_LOGIN_TRACKER_RELOAD_MS);
}

function stopBoschLoginTrackingWatch() {
  if (!boschLoginTrackerReloadTimer) {
    return;
  }

  window.clearInterval(boschLoginTrackerReloadTimer);
  boschLoginTrackerReloadTimer = null;
}

function wireButtons() {
  elements.toggleModeButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleMode();
  });

  elements.hideOverlayButton.addEventListener("click", async () => {
    await window.isleOverlay.toggleVisibility();
  });

  elements.quitOverlayButton.addEventListener("click", async () => {
    await window.isleOverlay.quit();
  });

  elements.connectBoschButton.addEventListener("click", async () => {
    if (typeof window.isleOverlay.openBoschLogin === "function") {
      await window.isleOverlay.openBoschLogin();
      elements.boschSheet.classList.add("hidden");
      startBoschLoginTrackingWatch();
      return;
    } else if (state.overlayMode !== "expanded") {
      await window.isleOverlay.setMode("expanded");
    }
    elements.boschSheet.classList.remove("hidden");
    setBoschLoginZoom();
  });

  elements.closeBoschSheet.addEventListener("click", () => {
    elements.boschSheet.classList.add("hidden");
  });

  elements.reloadBoschButton.addEventListener("click", () => {
    elements.boschView.reload();
  });

  elements.boschHomeButton.addEventListener("click", () => {
    elements.boschView.loadURL(state.boschHomeUrl);
    setBoschLoginZoom();
  });

  elements.boschTrackerButton.addEventListener("click", () => {
    elements.boschView.loadURL(state.boschTrackerUrl);
    setBoschLoginZoom();
  });

  elements.boschBackButton.addEventListener("click", () => {
    if (elements.boschView.canGoBack()) {
      elements.boschView.goBack();
    }
  });

  elements.boschReloadButton.addEventListener("click", () => {
    elements.boschView.reload();
    setBoschLoginZoom();
  });

  elements.partyIdentityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitPartyCreate();
  });

  elements.partyRoomForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitPartyJoin();
  });

  elements.partyLeaveButton.addEventListener("click", async () => {
    await leavePartyRoom();
  });

  elements.partyRoomInput.addEventListener("input", () => {
    elements.partyRoomInput.value = String(elements.partyRoomInput.value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
  });

  elements.coordsForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitCustomCoords();
  });

  elements.clearCoordsButton.addEventListener("click", async () => {
    await clearCustomCoords();
  });

  elements.zoneToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const layer = button.dataset.layerToggle;
      if (!layer || !(layer in state.zoneVisibility)) {
        return;
      }

      state.zoneVisibility[layer] = !state.zoneVisibility[layer];
      button.classList.toggle("active", state.zoneVisibility[layer]);
      button.setAttribute("aria-pressed", String(state.zoneVisibility[layer]));
      renderMap();
    });
  });

  elements.resourceToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const layer = button.dataset.resourceToggle;
      if (!layer || !(layer in state.resourceVisibility)) {
        return;
      }

      state.resourceVisibility[layer] = !state.resourceVisibility[layer];
      button.classList.toggle("active", state.resourceVisibility[layer]);
      button.setAttribute("aria-pressed", String(state.resourceVisibility[layer]));
      renderMap();
    });
  });
}

function wireOverlayBridge() {
  window.isleOverlay.getInfo().then((info) => {
    applyOverlayState(info);
  });

  window.isleOverlay.onStateChange((info) => {
    applyOverlayState(info);
  });

  if (typeof window.isleOverlay.onBoschLoginClosed === "function") {
    window.isleOverlay.onBoschLoginClosed(() => {
      stopBoschLoginTrackingWatch();
      elements.boschView.reload();
    });
  }
}

function wireMapView() {
  elements.mapView.addEventListener("click", (event) => {
    if (state.dragState.suppressClick) {
      state.dragState.suppressClick = false;
      return;
    }

    const point = clientToGamePoint(event);
    if (!point) {
      return;
    }

    state.pinnedPosition = point;
    renderMap();
  });

  elements.mapView.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    state.pinnedPosition = null;
    renderMap();
  });

  elements.mapView.addEventListener(
    "wheel",
    (event) => {
      if (state.overlayMode !== "expanded") {
        return;
      }

      event.preventDefault();
      const zoomFactor = event.deltaY < 0 ? 1.14 : 0.88;
      updateExpandedZoom(zoomFactor, event.clientX, event.clientY);
    },
    { passive: false }
  );

  elements.mapView.addEventListener("mousedown", (event) => {
    if (state.overlayMode !== "expanded" || event.button !== 0 || state.expandedZoom <= 1) {
      return;
    }

    state.dragState.active = true;
    state.dragState.suppressClick = false;
    state.dragState.startClientX = event.clientX;
    state.dragState.startClientY = event.clientY;
    state.dragState.startPanX = state.expandedPan.x;
    state.dragState.startPanY = state.expandedPan.y;
    renderMap();
  });

  window.addEventListener("mousemove", (event) => {
    if (!state.dragState.active) {
      return;
    }

    const deltaX = event.clientX - state.dragState.startClientX;
    const deltaY = event.clientY - state.dragState.startClientY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      state.dragState.suppressClick = true;
    }

    state.expandedPan.x = state.dragState.startPanX + deltaX;
    state.expandedPan.y = state.dragState.startPanY + deltaY;
    renderMap();
  });

  window.addEventListener("mouseup", () => {
    if (!state.dragState.active) {
      return;
    }

    state.dragState.active = false;
    renderMap();
  });

  elements.mapView.addEventListener("dblclick", () => {
    if (state.overlayMode !== "expanded") {
      return;
    }

    state.expandedZoom = 1;
    state.expandedPan = { x: 0, y: 0 };
    renderMap();
  });

  window.addEventListener("resize", () => {
    renderMap();
  });

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(() => {
      renderMap();
    });
    observer.observe(elements.mapView);
  }
}

function wireBoschView() {
  elements.boschView.addEventListener("ipc-message", async (event) => {
    if (event.channel !== "bosch:update" || !event.args.length) {
      return;
    }

    const snapshot = event.args[0];
    state.lastSnapshot = snapshot;
    void window.isleOverlay.writeDebugSnapshot(snapshot);
    updateHud(snapshot);

    if (snapshot.pageState === "live") {
      elements.boschSheet.classList.add("hidden");
      stopBoschLoginTrackingWatch();
      if (typeof window.isleOverlay.closeBoschLogin === "function") {
        await window.isleOverlay.closeBoschLogin();
      }
      await syncTrackerToMap(snapshot);
    }
  });

  elements.boschView.addEventListener("did-fail-load", () => {
    updateHud({
      pageState: "error",
      fields: {
        status: "Bosch failed to load"
      }
    });
  });

  elements.boschView.addEventListener("did-navigate", () => {
    elements.coordsFeedback.textContent =
      "If Bosch lands on the homepage, use Tracker to jump back to the tracker page, then log in with Steam.";
  });
}

function applyOverlayState(info) {
  if (!info) {
    return;
  }

  elements.hotkeyLabel.textContent = info.hotkey || "F8";
  updateModeUi(info.mode || "compact");
}

function updateModeUi(mode) {
  state.overlayMode = mode;
  elements.body.dataset.mode = mode;
  elements.toggleModeButton.textContent = mode === "compact" ? "Full Map" : "Compact";

  if (mode !== "expanded") {
    state.dragState.active = false;
  }

  if (state.lastSnapshot) {
    updateHud(state.lastSnapshot);
  }

  renderMap();
}

function updateHud(snapshot) {
  const fields = snapshot?.fields || {};
  const pageState = snapshot?.pageState || "waiting";
  const live = pageState === "live";
  const trackerVisible = pageState === "tracker";

  elements.modeDot.classList.toggle("live", live);
  elements.connectionLabel.textContent = getConnectionLabel(pageState, fields.status);
  elements.statusValue.textContent = fields.status || getFallbackStatus(pageState);
  elements.updatedValue.textContent = fields.lastUpdated || "--";
  elements.serverValue.textContent = fields.server || "--";
  elements.zoneValue.textContent = getCurrentZoneLabel(state.currentPosition);
  elements.mapXValue.textContent = fields.mapX || "--";
  elements.mapYValue.textContent = fields.mapY || "--";
  elements.altitudeValue.textContent = fields.altitude || "--";

  if (pageState === "auth-required") {
    elements.helperCopy.textContent =
      "Open Connect Bosch, sign in with Steam, then leave the Bosch panel open until your live tracker values appear.";
  } else if (live) {
    elements.helperCopy.textContent =
      state.overlayMode === "expanded"
        ? "Bosch is live. Scroll to zoom the fullscreen map, drag to pan, double-click to reset, left-click to pin a route, and right-click to clear it."
        : "Bosch is live. Click the map to pin a destination route, and right-click the map to clear it.";
  } else if (trackerVisible) {
    elements.helperCopy.textContent =
      "Bosch is open, but I am not receiving live coordinates yet. Leave the Bosch panel open on the tracker page and press Reload Bosch once if needed.";
  } else if (pageState === "challenge") {
    elements.helperCopy.textContent =
      "Bosch is passing Cloudflare's browser check. Give it a moment, then open Connect Bosch if it still needs attention.";
  } else {
    elements.helperCopy.textContent =
      "The overlay will follow Bosch Island after you sign in once with Steam. F8 toggles fullscreen, F9 hides the overlay, and map clicks place a route pin.";
  }
}

function getConnectionLabel(pageState, status) {
  if (pageState === "live") {
    return "Bosch live";
  }

  if (pageState === "tracker") {
    return "Bosch waiting on coords";
  }

  if (pageState === "auth-required") {
    return "Bosch login needed";
  }

  if (pageState === "challenge") {
    return "Bosch security check";
  }

  if (status) {
    return status;
  }

  return "Waiting for Bosch";
}

function getFallbackStatus(pageState) {
  switch (pageState) {
    case "auth-required":
      return "Login Needed";
    case "challenge":
      return "Checking";
    case "error":
      return "Unavailable";
    default:
      return "Waiting";
  }
}

async function syncTrackerToMap(snapshot) {
  const currentPosition = normalizeTrackerPosition(
    parseTrackerNumber(snapshot?.fields?.mapX),
    parseTrackerNumber(snapshot?.fields?.mapY)
  );

  if (!currentPosition) {
    state.currentPosition = null;
    state.playerHeadingRadians = -Math.PI / 2;
    renderMap();
    await syncPartyPosition(null);
    return;
  }

  updatePlayerHeading(currentPosition);
  state.currentPosition = currentPosition;
  renderMap();
  await syncPartyPosition(currentPosition);
}

async function submitCustomCoords() {
  const parsed = parseCoordinateInput(elements.coordsInput.value);
  if (!parsed) {
    elements.coordsFeedback.textContent =
      "Could not parse those coordinates. Use `200, -56`, `X=200 Y=-56`, or Bosch-style values like `412.5 175.5`.";
    return;
  }

  const currentPosition = normalizeTrackerPosition(parsed.x, parsed.y);
  if (!currentPosition) {
    elements.coordsFeedback.textContent = "Those coordinates are not valid for the map.";
    return;
  }

  updatePlayerHeading(currentPosition);
  state.currentPosition = currentPosition;
  renderMap();
  await syncPartyPosition(currentPosition, { force: true });
  elements.coordsFeedback.textContent = `Plotted ${roundSharedCoord(parsed.x)}, ${roundSharedCoord(parsed.y)} on the map.`;
}

async function clearCustomCoords() {
  state.currentPosition = null;
  state.playerHeadingRadians = -Math.PI / 2;
  renderMap();
  await syncPartyPosition(null, { force: true });
  elements.coordsInput.value = "";
  elements.coordsFeedback.textContent = "Custom coordinates cleared.";
}

function renderMap() {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const containScale = Math.min(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  const coverScale = Math.max(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  let scale = containScale;
  let x = 0;
  let y = 0;

  if (state.overlayMode === "compact") {
    const focus = pointToScene(state.currentPosition || mapCenter);
    scale = Math.max(coverScale * (state.currentPosition ? 6.15 : 4.4), containScale);
    x = rect.width / 2 - focus.x * scale;
    y = rect.height / 2 - focus.y * scale;
    x = clamp(x, rect.width - MAP_CONFIG.imageSize * scale, 0);
    y = clamp(y, rect.height - MAP_CONFIG.imageSize * scale, 0);
    elements.mapView.style.cursor = "crosshair";
  } else {
    scale = containScale * state.expandedZoom;
    const baseX = (rect.width - MAP_CONFIG.imageSize * scale) / 2;
    const baseY = (rect.height - MAP_CONFIG.imageSize * scale) / 2;
    x = baseX + state.expandedPan.x;
    y = baseY + state.expandedPan.y;
    x = clamp(x, rect.width - MAP_CONFIG.imageSize * scale, 0);
    y = clamp(y, rect.height - MAP_CONFIG.imageSize * scale, 0);
    state.expandedPan.x = x - baseX;
    state.expandedPan.y = y - baseY;
    elements.mapView.style.cursor = state.dragState.active ? "grabbing" : state.expandedZoom > 1 ? "grab" : "crosshair";
  }

  state.mapTransform = { scale, x, y };
  elements.mapScene.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  elements.mapScene.style.setProperty("--label-screen-scale", String(clamp(1 / scale, 0.12, 5.4)));

  renderMigrationZones();
  renderWaterShapes();
  renderLabels();
  renderResourceMarkers();
  renderPartyMarkers();
  elements.zoneValue.textContent = getCurrentZoneLabel(state.currentPosition);

  const route = getActiveRoute();
  drawPolyline(elements.routeShadow, route);
  drawPolyline(elements.routeLine, route);
  drawPlayerCone(elements.routePlayerCone, state.currentPosition, state.playerHeadingRadians);
  drawMarker(elements.routePlayer, state.currentPosition);
  drawMarker(elements.routePin, state.pinnedPosition);
  updateCompass();
}

function renderWaterShapes() {
  elements.waterShapes.innerHTML = WATER_SHAPES.map(renderWaterShape).join("");
}

function renderWaterShape(shape) {
  const points = shape.points.map((point) => {
    const scenePoint = pointToScene(point);
    return `${scenePoint.x},${scenePoint.y}`;
  }).join(" ");
  return `<polygon class="map-water-shape" data-water-id="${escapeHtml(shape.id)}" points="${points}"></polygon>`;
}

function renderMigrationZones() {
  const visibleZones = MIGRATION_ZONES.filter((zone) => state.zoneVisibility[zone.zoneKind || "migration"]);
  const shapes = visibleZones.map((zone) => renderMigrationZoneShape(zone)).join("");
  const sanctuaryMarkers = visibleZones
    .filter((zone) => zone.zoneKind === "sanctuary")
    .map((zone) => renderSanctuaryMarker(zone))
    .join("");
  elements.migrationZoneShapes.innerHTML = shapes;
  elements.sanctuaryMarkers.innerHTML = sanctuaryMarkers;
  elements.migrationZoneMarkers.innerHTML = "";
}

function renderLabels() {
  const labelPriority = {
    water: 1,
    region: 2,
    structure: 3,
    sanctuary: 4
  };

  const labels = [...MAP_LABELS]
    .filter((label) => shouldRenderMapLabel(label))
    .sort((left, right) => (labelPriority[left.kind] || 0) - (labelPriority[right.kind] || 0))
    .map((label) => {
    const point = pointToScene({ x: label.x, y: label.y });
    const className = [
      "map-label",
      label.kind,
      label.kind === "sanctuary" ? "has-icon" : "",
      isSmallWaterSpotLabel(label) ? "water-spot" : ""
    ].filter(Boolean).join(" ");
    return `<div class="${className}" style="left:${point.x}px;top:${point.y}px;">${renderLabelInner(label)}</div>`;
    })
    .join("");

  elements.mapLabelLayer.innerHTML = labels;
}

function renderResourceMarkers() {
  const markers = [];

  if (state.resourceVisibility.gastro) {
    markers.push(...renderResourceMarkerGroup(VULNONA_EARTHWORKS.Gastro || [], "gastro", "Gastro"));
  }

  if (state.resourceVisibility.saltRock) {
    markers.push(...renderResourceMarkerGroup(VULNONA_EARTHWORKS.SaltRock || [], "saltRock", "SaltRock"));
  }

  elements.mapMudImage.classList.toggle("active", state.resourceVisibility.mudPool);
  elements.resourceMarkerLayer.innerHTML = markers.join("");
}

function renderResourceMarkerGroup(points, kind, label) {
  return points.map((point) => {
    const scenePoint = pointToScene(point);
    return `<span class="resource-marker ${kind}" style="left:${scenePoint.x}px;top:${scenePoint.y}px;" title="${escapeHtml(label)}">${renderResourceIcon(kind)}</span>`;
  });
}

function renderResourceIcon(kind) {
  if (kind === "saltRock") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="#eaffff" d="M8 7.5h8l1.2 12.2c.1.9-.6 1.8-1.6 1.8H8.4c-1 0-1.7-.9-1.6-1.8L8 7.5Z"></path>
        <path fill="#79eaff" d="M8.8 4.4c0-1 .8-1.9 1.9-1.9h2.6c1 0 1.9.8 1.9 1.9v1.9H8.8V4.4Z"></path>
        <path fill="#1f3944" d="M10.2 10h3.6v1.4h-3.6V10Zm-.3 3h4.2v1.4H9.9V13Zm.5 3h3.2v1.4h-3.2V16Z"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#d7d1c7" d="M4.1 14.6 6.7 7l5.6-3 6.3 2.7 2.4 6.8-4.4 5.8-8.1.8-4.4-5.5Z"></path>
      <path fill="#938a7f" d="M6.7 7 12.3 4l1.2 5.1-5.2 2.2-1.6-4.3Zm6.8 2.1 5.1-2.4 2.4 6.8-5.4-1.2-2.1-3.2Zm-5.2 2.2 5.2-2.2 2.1 3.2-2.8 4.7-6.7-1.1 2.2-4.6Z"></path>
      <path fill="#f2eee8" opacity=".72" d="m8.3 6.9 3.2-1.7.5 2.4-2.8 1.2-.9-1.9Z"></path>
    </svg>
  `;
}

function shouldRenderMapLabel(label) {
  if (!label) {
    return false;
  }

  if (label.kind === "region") {
    return true;
  }

  if (label.kind !== "water") {
    return false;
  }

  if (label.text === "Delta River") {
    return false;
  }

  if (isNearbyCurrentLabel(label)) {
    return true;
  }

  return IMPORTANT_WATER_LABELS.has(label.text) || isSmallWaterSpotLabel(label);
}

function isSmallWaterSpotLabel(label) {
  return label?.kind === "water" && /pond|puddle|pool/i.test(label.text || "");
}

function isNearbyCurrentLabel(label) {
  if (!state.currentPosition) {
    return false;
  }

  const distance = Math.hypot(label.x - state.currentPosition.x, label.y - state.currentPosition.y);
  return distance < 52000;
}

function renderPartyMarkers() {
  const members = getSortedPartyMembers().filter((member) => {
    if (!member || member.playerId === state.party.playerId || !member.coords) {
      return false;
    }

    return Boolean(normalizeSharedCoords(member.coords));
  });

  const markup = members
    .map((member) => {
      const point = pointToScene(normalizeSharedCoords(member.coords));
      const name = escapeHtml(member.name || "Friend");
      const color = escapeHtml(getPartyMemberColor(member));
      return `
        <div class="party-marker" style="left:${point.x}px;top:${point.y}px;--party-color:${color};" title="${name}">
          <span>${escapeHtml(initialsForName(member.name || "Friend"))}</span>
          <span class="party-marker-name">${name}</span>
        </div>
      `;
    })
    .join("");

  elements.partyMarkerLayer.innerHTML = markup;
}

async function partyRequest(pathname, options = {}) {
  return window.isleOverlay.partyRequest({
    pathname,
    method: options.method || "GET",
    body: options.body
  });
}

async function submitPartyCreate() {
  try {
    const name = getPartyDisplayName();
    elements.partyFeedback.textContent = "Creating room...";
    const payload = await partyRequest("/api/party/rooms/create", {
      method: "POST",
      body: {
        name,
        color: state.party.color || nextPartyColor()
      }
    });

    applyPartyStateResponse(payload, name);
    startPartyPolling();
    elements.partyFeedback.textContent = `Room ${state.party.roomCode} is live. Share that code with friends.`;
    await syncPartyPosition(state.currentPosition, { force: true });
  } catch (error) {
    elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function submitPartyJoin() {
  try {
    const roomCode = sanitizeRoomCode(elements.partyRoomInput.value);
    if (!roomCode) {
      elements.partyFeedback.textContent = "Enter a valid 6-character room code.";
      return;
    }

    const name = getPartyDisplayName();
    elements.partyFeedback.textContent = `Joining room ${roomCode}...`;
    const payload = await partyRequest(`/api/party/rooms/${roomCode}/join`, {
      method: "POST",
      body: {
        playerId: state.party.playerId,
        name,
        color: state.party.color || nextPartyColor()
      }
    });

    applyPartyStateResponse(payload, name);
    startPartyPolling();
    elements.partyFeedback.textContent = `Joined room ${state.party.roomCode}. Friend markers now sync into this overlay.`;
    await syncPartyPosition(state.currentPosition, { force: true });
  } catch (error) {
    elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
  }
}

async function leavePartyRoom() {
  if (state.party.roomCode && state.party.playerId) {
    try {
      await partyRequest(`/api/party/rooms/${state.party.roomCode}/leave`, {
        method: "POST",
        body: {
          playerId: state.party.playerId
        }
      });
    } catch {
      // Ignore leave failures and clear the local session anyway.
    }
  }

  clearPartySession();
  updatePartyUi();
  renderPartyMarkers();
  elements.partyFeedback.textContent = "Left the room. Your overlay is no longer sharing live position.";
}

async function refreshPartyState(options = { quiet: false }) {
  if (!state.party.roomCode) {
    return;
  }

  try {
    const playerIdSearch = state.party.playerId ? `?playerId=${encodeURIComponent(state.party.playerId)}` : "";
    const payload = await partyRequest(`/api/party/rooms/${state.party.roomCode}/state${playerIdSearch}`);
    applyPartyStateResponse(payload, state.party.playerName);
    if (!options.quiet) {
      elements.partyFeedback.textContent = `Room ${state.party.roomCode} synced. ${visiblePartyMemberCount()} friend marker(s) visible.`;
    }
  } catch (error) {
    if (!options.quiet) {
      elements.partyFeedback.textContent = error instanceof Error ? error.message : String(error);
    }
  }
}

function startPartyPolling() {
  if (state.partyTimer) {
    clearInterval(state.partyTimer);
  }

  if (!state.party.roomCode) {
    return;
  }

  state.partyTimer = setInterval(() => {
    refreshPartyState({ quiet: true }).catch((error) => console.error(error));
  }, PARTY_POLL_INTERVAL_MS);
}

async function syncPartyPosition(point, options = {}) {
  if (!state.party.roomCode || !state.party.playerId) {
    return;
  }

  const coords = point ? toSharedCoords(point) : null;
  const key = coords ? `${coords.x}:${coords.y}:${coords.z ?? 0}` : "null";
  const now = Date.now();

  if (!options.force && state.party.lastSharedKey === key && now - state.party.lastSharedAt < 8000) {
    return;
  }

  const payload = {
    playerId: state.party.playerId,
    name: getPartyDisplayName(),
    color: state.party.color || nextPartyColor(),
    coords
  };

  try {
    const response = await partyRequest(`/api/party/rooms/${state.party.roomCode}/update`, {
      method: "POST",
      body: payload
    });
    state.party.lastSharedKey = key;
    state.party.lastSharedAt = now;
    applyPartyStateResponse(response, payload.name);
  } catch (error) {
    console.error(error);
  }
}

function hydratePartySession() {
  try {
    const stored = JSON.parse(localStorage.getItem(PARTY_SESSION_KEY) || "null");
    if (stored && typeof stored === "object") {
      state.party.roomCode = sanitizeRoomCode(stored.roomCode);
      state.party.playerId = typeof stored.playerId === "string" ? stored.playerId : null;
      state.party.playerName = typeof stored.playerName === "string" ? stored.playerName : "";
      state.party.color = typeof stored.color === "string" ? stored.color : null;
    }
  } catch {
    // Ignore malformed local sessions.
  }

  if (!state.party.color) {
    state.party.color = nextPartyColor();
  }

  if (state.party.playerName) {
    elements.partyNameInput.value = state.party.playerName;
  }

  if (state.party.roomCode) {
    elements.partyRoomInput.value = state.party.roomCode;
  }
}

function persistPartySession() {
  localStorage.setItem(
    PARTY_SESSION_KEY,
    JSON.stringify({
      roomCode: state.party.roomCode,
      playerId: state.party.playerId,
      playerName: state.party.playerName,
      color: state.party.color
    })
  );
}

function clearPartySession() {
  state.party.roomCode = null;
  state.party.playerId = null;
  state.party.members = [];
  state.party.lastSharedKey = null;
  state.party.lastSharedAt = 0;
  if (state.partyTimer) {
    clearInterval(state.partyTimer);
    state.partyTimer = null;
  }
  localStorage.removeItem(PARTY_SESSION_KEY);
}

function applyPartyStateResponse(payload, fallbackName) {
  if (!payload?.ok) {
    throw new Error(payload?.error || "Room request failed.");
  }

  state.party.roomCode = sanitizeRoomCode(payload.roomCode);
  state.party.members = Array.isArray(payload.members) ? payload.members : [];

  if (payload.self) {
    state.party.playerId = payload.self.playerId;
    state.party.playerName = payload.self.name || fallbackName || state.party.playerName;
    state.party.color = payload.self.color || state.party.color || nextPartyColor();
  } else if (fallbackName) {
    state.party.playerName = fallbackName;
  }

  persistPartySession();
  updatePartyUi();
  renderPartyMembers();
  renderPartyMarkers();
}

function updatePartyUi() {
  elements.partyRoomActive.textContent = state.party.roomCode ? `Room ${state.party.roomCode}` : "No room joined";
  elements.partyLeaveButton.classList.toggle("hidden", !state.party.roomCode);
  if (state.party.roomCode) {
    elements.partyRoomInput.value = state.party.roomCode;
  }
  if (state.party.playerName) {
    elements.partyNameInput.value = state.party.playerName;
  }
}

function renderPartyMembers() {
  if (!state.party.members.length) {
    elements.partyMemberList.innerHTML = "";
    return;
  }

  elements.partyMemberList.innerHTML = getSortedPartyMembers()
    .map((member) => {
      const markerColor = escapeHtml(getPartyMemberColor(member));
      const coords = member.coords ? formatSharedCoords(member.coords) : "waiting";
      return `
        <div class="party-member-chip" style="--member-color:${markerColor};">
          <span class="party-member-swatch" aria-hidden="true"></span>
          <span class="party-member-name">${escapeHtml(member.name || "Friend")}${member.playerId === state.party.playerId ? " (You)" : ""}</span>
          <span class="party-member-coords">${coords}</span>
        </div>
      `;
    })
    .join("");
}

function visiblePartyMemberCount() {
  return state.party.members.filter((member) => member.playerId !== state.party.playerId && member.coords).length;
}

function getSortedPartyMembers() {
  return [...state.party.members].sort((left, right) => {
    const leftKey = `${left?.playerId || ""}:${left?.name || ""}`;
    const rightKey = `${right?.playerId || ""}:${right?.name || ""}`;
    return leftKey.localeCompare(rightKey);
  });
}

function getPartyMemberColor(member) {
  const sortedMembers = getSortedPartyMembers();
  const memberIndex = Math.max(
    0,
    sortedMembers.findIndex((candidate) => candidate.playerId === member.playerId)
  );

  return PARTY_COLOR_PALETTE[memberIndex % PARTY_COLOR_PALETTE.length];
}

function getPartyDisplayName() {
  const value = String(elements.partyNameInput.value || "")
    .trim()
    .replace(/\s+/g, " ");
  state.party.playerName = (value || state.party.playerName || "Anonymous").slice(0, 24);
  return state.party.playerName;
}

function sanitizeRoomCode(value) {
  const normalized = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return normalized.length === 6 ? normalized : null;
}

function nextPartyColor() {
  const seed = `${state.party.playerName || ""}:${state.party.playerId || ""}:${state.party.roomCode || ""}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return PARTY_COLOR_PALETTE[hash % PARTY_COLOR_PALETTE.length];
}

function initialsForName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "?";
  }

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
}

function toSharedCoords(point) {
  return {
    x: roundSharedCoord(point.x / 1000),
    y: roundSharedCoord(point.y / 1000),
    z: 0
  };
}

function normalizeSharedCoords(coords) {
  const rawX = Number(coords?.x);
  const rawY = Number(coords?.y);
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
    return null;
  }

  return {
    x: normalizeRouteCoordinate(rawX),
    y: normalizeRouteCoordinate(rawY)
  };
}

function roundSharedCoord(value) {
  return Math.round(value * 100) / 100;
}

function formatSharedCoords(coords) {
  return `${roundSharedCoord(Number(coords.x) || 0)}, ${roundSharedCoord(Number(coords.y) || 0)}`;
}

function renderLabelInner(label) {
  if (label.kind === "sanctuary") {
    return `${renderSanctuaryIcon()}<span>${escapeHtml(label.text)}</span>`;
  }

  return escapeHtml(label.text);
}

function renderMigrationZoneShape(zone) {
  const { shape } = zone;
  const zoneClass = escapeHtml(zone.zoneKind || "migration");

  if (shape.kind === "ellipse") {
    const center = pointToScene(shape.center);
    const rx = worldWidthToScene(shape.width) / 2;
    const ry = worldHeightToScene(shape.height) / 2;
    const transform = shape.rotation ? ` transform="rotate(${shape.rotation} ${center.x} ${center.y})"` : "";
    return `<ellipse class="migration-zone-shape ${zoneClass}" cx="${center.x}" cy="${center.y}" rx="${rx}" ry="${ry}"${transform}></ellipse>`;
  }

  if (shape.kind === "rect") {
    const center = pointToScene(shape.center);
    const width = worldWidthToScene(shape.width);
    const height = worldHeightToScene(shape.height);
    const rx = worldWidthToScene(shape.cornerRadius || 0);
    const ry = worldHeightToScene(shape.cornerRadius || 0);
    const transform = shape.rotation ? ` transform="rotate(${shape.rotation} ${center.x} ${center.y})"` : "";
    return `<rect class="migration-zone-shape ${zoneClass}" x="${center.x - width / 2}" y="${center.y - height / 2}" width="${width}" height="${height}" rx="${rx}" ry="${ry}"${transform}></rect>`;
  }

  const points = shape.points.map((point) => {
    const scenePoint = pointToScene(point);
    return `${scenePoint.x},${scenePoint.y}`;
  }).join(" ");
  return `<polygon class="migration-zone-shape ${zoneClass}" points="${points}"></polygon>`;
}

function renderMigrationZoneMarker(zone) {
  const center = pointToScene(zone.center);
  const zoneClass = escapeHtml(zone.zoneKind || "migration");
  return `
    <g class="migration-zone-marker ${zoneClass}" transform="translate(${center.x} ${center.y})">
      <circle class="migration-zone-marker-glow" r="42"></circle>
      <circle class="migration-zone-marker-badge" r="26"></circle>
      ${renderMigrationIcon()}
      <text class="migration-zone-marker-name" y="46">${escapeHtml(zone.name)}</text>
    </g>
  `;
}

function renderSanctuaryMarker(label) {
  const center = pointToScene(label.center || { x: label.x, y: label.y });
  const name = label.name || label.text;
  return `
    <g class="sanctuary-marker" transform="translate(${center.x} ${center.y})">
      <circle class="sanctuary-marker-glow" r="40"></circle>
      <circle class="sanctuary-marker-badge" r="24"></circle>
      <g class="sanctuary-marker-icon" transform="translate(-12 -14) scale(0.75)">
        <path d="M15 29h2l1-7h-4z"></path>
        <path d="M16 11c-4.2 0-8.4 1.9-11 5.3 4-1 7.6-.6 11 1.1-1.9-3.3-5-5.6-8.8-6.7C10 9.8 13 9.8 16 11Z"></path>
        <path d="M16 11c4.2 0 8.4 1.9 11 5.3-4-1-7.6-.6-11 1.1 1.9-3.3 5-5.6 8.8-6.7C22 9.8 19 9.8 16 11Z"></path>
        <path d="M16 14c-4.5-.4-8.7 1.1-12 4.1 4.4-.4 8.4.5 12 2.6-1.5-2.2-3.6-4.2-6.4-5.5C12 14.6 14 14.2 16 14Z"></path>
        <path d="M16 14c4.5-.4 8.7 1.1 12 4.1-4.4-.4-8.4.5-12 2.6 1.5-2.2 3.6-4.2 6.4-5.5C20 14.6 18 14.2 16 14Z"></path>
        <path d="M16 4c-2.7 2.1-4.2 4.6-4.4 7.6 1.5-1.4 2.9-2.1 4.4-2.2 1.5.1 2.9.8 4.4 2.2C20.2 8.6 18.7 6.1 16 4Z"></path>
      </g>
      <text class="sanctuary-marker-name" y="46">${escapeHtml(name)}</text>
    </g>
  `;
}

function renderSanctuaryIcon() {
  return `
    <span class="map-label-icon sanctuary-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M15 29h2l1-7h-4z"></path>
        <path d="M16 11c-4.2 0-8.4 1.9-11 5.3 4-1 7.6-.6 11 1.1-1.9-3.3-5-5.6-8.8-6.7C10 9.8 13 9.8 16 11Z"></path>
        <path d="M16 11c4.2 0 8.4 1.9 11 5.3-4-1-7.6-.6-11 1.1 1.9-3.3 5-5.6 8.8-6.7C22 9.8 19 9.8 16 11Z"></path>
        <path d="M16 14c-4.5-.4-8.7 1.1-12 4.1 4.4-.4 8.4.5 12 2.6-1.5-2.2-3.6-4.2-6.4-5.5C12 14.6 14 14.2 16 14Z"></path>
        <path d="M16 14c4.5-.4 8.7 1.1 12 4.1-4.4-.4-8.4.5-12 2.6 1.5-2.2 3.6-4.2 6.4-5.5C20 14.6 18 14.2 16 14Z"></path>
        <path d="M16 4c-2.7 2.1-4.2 4.6-4.4 7.6 1.5-1.4 2.9-2.1 4.4-2.2 1.5.1 2.9.8 4.4 2.2C20.2 8.6 18.7 6.1 16 4Z"></path>
      </svg>
    </span>
  `;
}

function renderMigrationIcon() {
  return `
      <g class="migration-zone-marker-icon" aria-hidden="true">
        <ellipse cx="-7" cy="-1" rx="4.3" ry="6.6"></ellipse>
        <circle cx="-11.5" cy="-7.8" r="2.2"></circle>
        <circle cx="-7.7" cy="-10" r="2.2"></circle>
        <circle cx="-3.8" cy="-7.6" r="2.2"></circle>
        <ellipse cx="7" cy="1.5" rx="4.3" ry="6.6"></ellipse>
        <circle cx="2.5" cy="-5.6" r="2.2"></circle>
        <circle cx="6.3" cy="-7.9" r="2.2"></circle>
        <circle cx="10.2" cy="-5.4" r="2.2"></circle>
      </g>
  `;
}

function drawPolyline(element, points) {
  element.setAttribute("points", points.map((point) => `${point.x},${point.y}`).join(" "));
}

function drawMarker(element, point) {
  if (!point) {
    element.setAttribute("visibility", "hidden");
    return;
  }

  const mapped = pointToScene(point);
  element.setAttribute("cx", mapped.x);
  element.setAttribute("cy", mapped.y);
  element.setAttribute("visibility", "visible");
}

function drawPlayerCone(element, point, headingRadians) {
  if (!point) {
    element.setAttribute("visibility", "hidden");
    return;
  }

  const safeHeading = Number.isFinite(headingRadians) ? headingRadians : -Math.PI / 2;
  const center = pointToScene(point);
  const innerRadius = 32;
  const outerRadius = 92;
  const spread = Math.PI / 2.4;
  const startAngle = safeHeading - spread / 2;
  const endAngle = safeHeading + spread / 2;
  const innerStart = polarPoint(center, innerRadius, startAngle);
  const outerStart = polarPoint(center, outerRadius, startAngle);
  const outerEnd = polarPoint(center, outerRadius, endAngle);
  const innerEnd = polarPoint(center, innerRadius, endAngle);
  const largeArcFlag = spread > Math.PI ? 1 : 0;
  const path = [
    `M ${innerStart.x} ${innerStart.y}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");

  const gradientStart = polarPoint(center, innerRadius, safeHeading);
  const gradientEnd = polarPoint(center, outerRadius, safeHeading);
  elements.routePlayerConeGradient.setAttribute("x1", `${gradientStart.x}`);
  elements.routePlayerConeGradient.setAttribute("y1", `${gradientStart.y}`);
  elements.routePlayerConeGradient.setAttribute("x2", `${gradientEnd.x}`);
  elements.routePlayerConeGradient.setAttribute("y2", `${gradientEnd.y}`);
  element.setAttribute("d", path);
  element.setAttribute("visibility", "visible");
}

function updateCompass() {
  const heading = Number.isFinite(state.playerHeadingRadians) ? state.playerHeadingRadians : -Math.PI / 2;
  const rotation = -radiansToDegrees(heading + Math.PI / 2);
  const pointAngles = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315
  };

  elements.mapCompassDial.style.transform = `rotate(${rotation}deg)`;
  elements.mapCompassDial.querySelectorAll("[data-compass-point]").forEach((point) => {
    const label = point.dataset.compassPoint;
    const angle = pointAngles[label] || 0;
    point.style.transform = `rotate(${angle}deg) translateY(calc(-1 * (var(--map-compass-radius, 210px)))) rotate(${-angle - rotation}deg)`;
  });
}

function radiansToDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function updatePlayerHeading(nextPosition) {
  if (!state.currentPosition) {
    return;
  }

  const deltaX = nextPosition.x - state.currentPosition.x;
  const deltaY = nextPosition.y - state.currentPosition.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance < 250) {
    return;
  }

  state.playerHeadingRadians = Math.atan2(-deltaY, deltaX);
}

function polarPoint(center, radius, angle) {
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
}

function getActiveRoute() {
  if (!state.currentPosition || !state.pinnedPosition) {
    return [];
  }

  return findRoute(state.currentPosition, state.pinnedPosition).map(pointToScene);
}

function pointToScene(point) {
  return {
    x: ((point.x - MAP_CONFIG.minX) / MAP_WORLD_WIDTH) * MAP_CONFIG.imageSize,
    y: ((MAP_CONFIG.maxY - point.y) / MAP_WORLD_HEIGHT) * MAP_CONFIG.imageSize
  };
}

function sceneToPoint(scenePoint) {
  return {
    x: MAP_CONFIG.minX + (scenePoint.x / MAP_CONFIG.imageSize) * MAP_WORLD_WIDTH,
    y: MAP_CONFIG.maxY - (scenePoint.y / MAP_CONFIG.imageSize) * MAP_WORLD_HEIGHT
  };
}

function mapUnits(value) {
  return value * 1000;
}

function toWorldPoint(point) {
  return {
    x: mapUnits(point.x),
    y: mapUnits(point.y)
  };
}

function normalizeMigrationZone(zone) {
  const center = toWorldPoint(zone.shape.center);

  if (zone.shape.kind === "ellipse") {
    return {
      ...zone,
      center,
      shape: {
        ...zone.shape,
        center,
        width: mapUnits(zone.shape.width),
        height: mapUnits(zone.shape.height)
      }
    };
  }

  if (zone.shape.kind === "rect") {
    return {
      ...zone,
      center,
      shape: {
        ...zone.shape,
        center,
        width: mapUnits(zone.shape.width),
        height: mapUnits(zone.shape.height),
        cornerRadius: mapUnits(zone.shape.cornerRadius || 0)
      }
    };
  }

  return {
    ...zone,
    center,
    shape: {
      ...zone.shape,
      center,
      points: zone.shape.points.map(toWorldPoint)
    }
  };
}

function worldWidthToScene(value) {
  return value * SCENE_SCALE_X;
}

function worldHeightToScene(value) {
  return value * SCENE_SCALE_Y;
}

function clientToGamePoint(event) {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  const relativeX = event.clientX - rect.left;
  const relativeY = event.clientY - rect.top;
  const sceneX = (relativeX - state.mapTransform.x) / state.mapTransform.scale;
  const sceneY = (relativeY - state.mapTransform.y) / state.mapTransform.scale;

  if (
    !Number.isFinite(sceneX) ||
    !Number.isFinite(sceneY) ||
    sceneX < 0 ||
    sceneY < 0 ||
    sceneX > MAP_CONFIG.imageSize ||
    sceneY > MAP_CONFIG.imageSize
  ) {
    return null;
  }

  return sceneToPoint({ x: sceneX, y: sceneY });
}

function buildRouteGraph() {
  const nodes = new Map(ROUTE_DATA.nodes.map((node) => [node.id, node]));
  const adjacency = new Map();

  ROUTE_DATA.nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  ROUTE_DATA.edges.forEach(([from, to]) => {
    const a = nodes.get(from);
    const b = nodes.get(to);
    if (!a || !b) {
      return;
    }

    const cost = distanceBetween(a, b);
    adjacency.get(from).push({ id: to, cost });
    adjacency.get(to).push({ id: from, cost });
  });

  return { nodes, adjacency };
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const a = polygon[index];
    const b = polygon[previous];
    const intersects =
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function orientation(a, b, c) {
  return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
}

function onSegment(a, b, c) {
  return (
    Math.min(a.x, c.x) <= b.x &&
    b.x <= Math.max(a.x, c.x) &&
    Math.min(a.y, c.y) <= b.y &&
    b.y <= Math.max(a.y, c.y)
  );
}

function segmentsIntersect(a1, a2, b1, b2) {
  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 === 0 && onSegment(a1, b1, a2)) {
    return true;
  }
  if (o2 === 0 && onSegment(a1, b2, a2)) {
    return true;
  }
  if (o3 === 0 && onSegment(b1, a1, b2)) {
    return true;
  }
  if (o4 === 0 && onSegment(b1, a2, b2)) {
    return true;
  }

  return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
}

function segmentBlocked(start, end) {
  return ROUTE_DATA.blockers.some((polygon) => {
    if (pointInPolygon(start, polygon) || pointInPolygon(end, polygon)) {
      return true;
    }

    for (let index = 0; index < polygon.length; index += 1) {
      const next = polygon[(index + 1) % polygon.length];
      if (segmentsIntersect(start, end, polygon[index], next)) {
        return true;
      }
    }

    return false;
  });
}

function visibleNodesFrom(point, limit = 4) {
  return ROUTE_DATA.nodes
    .map((node) => ({
      ...node,
      cost: distanceBetween(point, node)
    }))
    .filter((node) => !segmentBlocked(point, node))
    .sort((left, right) => left.cost - right.cost)
    .slice(0, limit);
}

function findRoute(start, end) {
  if (!segmentBlocked(start, end)) {
    return [start, end];
  }

  const tempNodes = new Map(routeGraph.nodes);
  const tempAdjacency = new Map(
    [...routeGraph.adjacency.entries()].map(([id, edges]) => [id, [...edges]])
  );

  tempNodes.set("__start__", start);
  tempNodes.set("__end__", end);
  tempAdjacency.set("__start__", []);
  tempAdjacency.set("__end__", []);

  const startLinks = visibleNodesFrom(start);
  const endLinks = visibleNodesFrom(end);

  if (!startLinks.length || !endLinks.length) {
    return [start, end];
  }

  startLinks.forEach((node) => {
    tempAdjacency.get("__start__").push({ id: node.id, cost: node.cost });
    tempAdjacency.get(node.id).push({ id: "__start__", cost: node.cost });
  });

  endLinks.forEach((node) => {
    tempAdjacency.get("__end__").push({ id: node.id, cost: node.cost });
    tempAdjacency.get(node.id).push({ id: "__end__", cost: node.cost });
  });

  const open = new Set(["__start__"]);
  const cameFrom = new Map();
  const gScore = new Map([["__start__", 0]]);
  const fScore = new Map([["__start__", distanceBetween(start, end)]]);

  while (open.size) {
    const current = [...open].reduce((best, candidate) => {
      if (best == null) {
        return candidate;
      }
      return (fScore.get(candidate) ?? Number.POSITIVE_INFINITY) <
        (fScore.get(best) ?? Number.POSITIVE_INFINITY)
        ? candidate
        : best;
    }, null);

    if (current === "__end__") {
      return smoothRoute(reconstructPath(cameFrom, current, tempNodes));
    }

    open.delete(current);
    const currentScore = gScore.get(current) ?? Number.POSITIVE_INFINITY;

    (tempAdjacency.get(current) ?? []).forEach((edge) => {
      const tentative = currentScore + edge.cost;
      if (tentative >= (gScore.get(edge.id) ?? Number.POSITIVE_INFINITY)) {
        return;
      }

      cameFrom.set(edge.id, current);
      gScore.set(edge.id, tentative);
      fScore.set(edge.id, tentative + distanceBetween(tempNodes.get(edge.id), end));
      open.add(edge.id);
    });
  }

  return [start, end];
}

function reconstructPath(cameFrom, current, nodes) {
  const path = [nodes.get(current)];
  let cursor = current;

  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.unshift(nodes.get(cursor));
  }

  return path;
}

function smoothRoute(points) {
  if (points.length <= 2) {
    return points;
  }

  const smoothed = [points[0]];
  let anchor = 0;

  while (anchor < points.length - 1) {
    let next = points.length - 1;
    while (next > anchor + 1 && segmentBlocked(points[anchor], points[next])) {
      next -= 1;
    }

    smoothed.push(points[next]);
    anchor = next;
  }

  return smoothed;
}

function parseTrackerNumber(value) {
  if (value == null) {
    return Number.NaN;
  }

  const raw = String(value).trim();
  if (!raw) {
    return Number.NaN;
  }

  const cleaned = raw.replace(/\s+/g, "").replace(/,(?=\d{3}\b)/g, "");
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return Number.NaN;
  }

  return Number(match[0]);
}

function parseCoordinateInput(value) {
  const matches = String(value || "").match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length < 2) {
    return null;
  }

  const x = Number(matches[0]);
  const y = Number(matches[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
}

function normalizeRouteCoordinate(value) {
  if (!Number.isFinite(value)) {
    return Number.NaN;
  }

  return Math.abs(value) < 2000 ? value * 1000 : value;
}

function normalizeTrackerPosition(rawX, rawY) {
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
    return null;
  }

  if (rawX >= 0 && rawX <= 750 && rawY >= 0 && rawY <= 750) {
    return calibrateTrackerZonePosition(applyAffineCalibration(rawX, rawY));
  }

  return {
    x: normalizeRouteCoordinate(rawY),
    y: -normalizeRouteCoordinate(rawX)
  };
}

function buildAffineCalibration(points) {
  return {
    x: solveAffineCoefficients(points, "x"),
    y: solveAffineCoefficients(points, "y")
  };
}

function solveAffineCoefficients(points, axis) {
  const normal = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  const target = [0, 0, 0];

  for (const point of points) {
    const row = [point.raw.x, point.raw.y, 1];
    const value = point.world[axis];
    for (let i = 0; i < 3; i += 1) {
      target[i] += row[i] * value;
      for (let j = 0; j < 3; j += 1) {
        normal[i][j] += row[i] * row[j];
      }
    }
  }

  const [a, b, c] = solveLinearSystem3(normal, target);
  return { a, b, c };
}

function solveLinearSystem3(matrix, target) {
  const rows = matrix.map((row, index) => [...row, target[index]]);

  for (let column = 0; column < 3; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < 3; row += 1) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) {
        pivot = row;
      }
    }

    if (pivot !== column) {
      [rows[column], rows[pivot]] = [rows[pivot], rows[column]];
    }

    const pivotValue = rows[column][column] || 1;
    for (let value = column; value < 4; value += 1) {
      rows[column][value] /= pivotValue;
    }

    for (let row = 0; row < 3; row += 1) {
      if (row === column) {
        continue;
      }
      const factor = rows[row][column];
      for (let value = column; value < 4; value += 1) {
        rows[row][value] -= factor * rows[column][value];
      }
    }
  }

  return rows.map((row) => row[3]);
}

function applyAffineCalibration(rawX, rawY) {
  const calibration = BOSCH_TRACKER_CONFIG.affineCalibration;
  return {
    x: rawX * calibration.x.a + rawY * calibration.x.b + calibration.x.c,
    y: rawX * calibration.y.a + rawY * calibration.y.b + calibration.y.c
  };
}

function calibrateTrackerZonePosition(point) {
  const containingZone = findContainingPriorityZone(point);
  if (containingZone) {
    return point;
  }

  const nearby = findNearestPriorityZone(point);
  if (!nearby || nearby.distance > TRACKER_ZONE_SNAP_MARGIN) {
    return point;
  }

  return pullPointIntoZone(point, nearby.zone) || point;
}

function getCurrentZoneLabel(point) {
  if (!point) {
    return "--";
  }

  const zone = findContainingPriorityZone(point) || findNearestPriorityZone(point, 18000)?.zone;
  if (!zone) {
    return "Open";
  }

  return `${getZoneKindShortLabel(zone.zoneKind)}: ${zone.name}`;
}

function getZoneKindShortLabel(kind) {
  if (kind === "patrol") {
    return "PZ";
  }
  if (kind === "sanctuary") {
    return "Sanctuary";
  }
  return "MZ";
}

function findContainingPriorityZone(point) {
  return MIGRATION_ZONES.find((zone) => isPriorityZone(zone) && isPointInZone(point, zone));
}

function findNearestPriorityZone(point, maxDistance = Infinity) {
  let nearest = null;
  MIGRATION_ZONES.forEach((zone) => {
    if (!isPriorityZone(zone)) {
      return;
    }

    const distance = approximateDistanceToZone(point, zone);
    if (distance <= maxDistance && (!nearest || distance < nearest.distance)) {
      nearest = { zone, distance };
    }
  });

  return nearest;
}

function isPriorityZone(zone) {
  return zone?.zoneKind === "patrol" || zone?.zoneKind === "sanctuary";
}

function approximateDistanceToZone(point, zone) {
  if (isPointInZone(point, zone)) {
    return 0;
  }

  if (zone.shape.kind === "ellipse") {
    const axes = getRotatedAxes(point, zone);
    const radiusX = Math.max(zone.shape.width / 2, 1);
    const radiusY = Math.max(zone.shape.height / 2, 1);
    const normalizedDistance = Math.hypot(axes.x / radiusX, axes.y / radiusY);
    return Math.max(0, normalizedDistance - 1) * Math.max(radiusX, radiusY);
  }

  if (zone.shape.kind === "rect") {
    const axes = getRotatedAxes(point, zone);
    const dx = Math.max(Math.abs(axes.x) - zone.shape.width / 2, 0);
    const dy = Math.max(Math.abs(axes.y) - zone.shape.height / 2, 0);
    return Math.hypot(dx, dy);
  }

  return getPolygonDistance(point, zone.shape.points || []);
}

function pullPointIntoZone(point, zone) {
  if (!zone?.center) {
    return null;
  }

  for (let step = 1; step <= 80; step += 1) {
    const amount = step / 80;
    const candidate = {
      x: point.x + (zone.center.x - point.x) * amount,
      y: point.y + (zone.center.y - point.y) * amount
    };

    if (isPointInZone(candidate, zone)) {
      return candidate;
    }
  }

  return zone.center;
}

function isPointInZone(point, zone) {
  if (!zone?.shape) {
    return false;
  }

  if (zone.shape.kind === "ellipse") {
    const axes = getRotatedAxes(point, zone);
    const radiusX = Math.max(zone.shape.width / 2, 1);
    const radiusY = Math.max(zone.shape.height / 2, 1);
    return (axes.x * axes.x) / (radiusX * radiusX) + (axes.y * axes.y) / (radiusY * radiusY) <= 1;
  }

  if (zone.shape.kind === "rect") {
    const axes = getRotatedAxes(point, zone);
    return Math.abs(axes.x) <= zone.shape.width / 2 && Math.abs(axes.y) <= zone.shape.height / 2;
  }

  return isPointInPolygon(point, zone.shape.points || []);
}

function getRotatedAxes(point, zone) {
  const rotation = -((zone.shape.rotation || 0) * Math.PI) / 180;
  const dx = point.x - zone.center.x;
  const dy = point.y - zone.center.y;
  return {
    x: dx * Math.cos(rotation) - dy * Math.sin(rotation),
    y: dx * Math.sin(rotation) + dy * Math.cos(rotation)
  };
}

function isPointInPolygon(point, points) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const currentPoint = points[index];
    const previousPoint = points[previous];
    const crosses =
      currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y || 1) +
          currentPoint.x;

    if (crosses) {
      inside = !inside;
    }
  }

  return inside;
}

function getPolygonDistance(point, points) {
  if (!points.length) {
    return Infinity;
  }

  return points.reduce((nearest, currentPoint, index) => {
    const nextPoint = points[(index + 1) % points.length];
    return Math.min(nearest, distanceToSegment(point, currentPoint, nextPoint));
  }, Infinity);
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
  const projected = {
    x: start.x + dx * t,
    y: start.y + dy * t
  };
  return Math.hypot(point.x - projected.x, point.y - projected.y);
}

function updateExpandedZoom(multiplier, clientX, clientY) {
  const rect = elements.mapView.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const oldTransform = { ...state.mapTransform };
  const relativeX = clientX - rect.left;
  const relativeY = clientY - rect.top;
  const anchorSceneX = (relativeX - oldTransform.x) / oldTransform.scale;
  const anchorSceneY = (relativeY - oldTransform.y) / oldTransform.scale;

  const nextZoom = clamp(state.expandedZoom * multiplier, 1, 6);
  state.expandedZoom = nextZoom;

  const containScale = Math.min(rect.width / MAP_CONFIG.imageSize, rect.height / MAP_CONFIG.imageSize);
  const nextScale = containScale * nextZoom;
  const nextBaseX = (rect.width - MAP_CONFIG.imageSize * nextScale) / 2;
  const nextBaseY = (rect.height - MAP_CONFIG.imageSize * nextScale) / 2;

  state.expandedPan.x = relativeX - anchorSceneX * nextScale - nextBaseX;
  state.expandedPan.y = relativeY - anchorSceneY * nextScale - nextBaseY;
  renderMap();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
