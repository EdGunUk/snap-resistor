import * as colors from "../styled/settings/colors";
import * as units from "./units";

const BASE = [
    {
        color: colors.BLACK,
        value: 0
    },
    {
        color: colors.BROWN,
        value: 1
    },
    {
        color: colors.RED,
        value: 2
    },
    {
        color: colors.ORANGE,
        value: 3
    },
    {
        color: colors.YELLOW,
        value: 4
    },
    {
        color: colors.GREEN,
        value: 5
    },
    {
        color: colors.BLUE,
        value: 6
    },
    {
        color: colors.PURPLE,
        value: 7
    },
    {
        color: colors.GRAY,
        value: 8
    },
    {
        color: colors.WHITE,
        value: 9
    }
];

const MULTIPLIER = [
    {
        color: colors.BLACK,
        unit: units.OHM,
        value: 1
    },
    {
        color: colors.BROWN,
        unit: units.OHM,
        value: 10
    },
    {
        color: colors.BROWN,
        unit: units.OHM,
        value: 100
    },
    {
        color: colors.ORANGE,
        unit: units.KILO_OHM,
        value: 1
    },
    {
        color: colors.YELLOW,
        unit: units.KILO_OHM,
        value: 10
    },
    {
        color: colors.GREEN,
        unit: units.KILO_OHM,
        value: 100
    },
    {
        color: colors.BLUE,
        unit: units.MEGA_OHM,
        value: 1
    },
    {
        color: colors.PURPLE,
        unit: units.MEGA_OHM,
        value: 10
    },
    {
        color: colors.GRAY,
        unit: units.MEGA_OHM,
        value: 100
    },
    {
        color: colors.WHITE,
        unit: units.GIGA_OHM,
        value: 1
    },
    {
        color: colors.GOLD,
        unit: units.OHM,
        value: 0.1
    },
    {
        color: colors.SILVER,
        unit: units.OHM,
        value: 0.01
    },
];

const TOLERANCE = [
    {
        color: colors.BROWN,
        value: 1
    },
    {
        color: colors.RED,
        value: 2
    },
    {
        color: colors.ORANGE,
        value: 3
    },
    {
        color: colors.YELLOW,
        value: 4
    },
    {
        color: colors.GREEN,
        value: 0.5
    },
    {
        color: colors.BLUE,
        value: 0.25
    },
    {
        color: colors.PURPLE,
        value: 0.1
    },
    {
        color: colors.GRAY,
        value: 0.05
    },
    {
        color: colors.GOLD,
        value: 5
    },
    {
        color: colors.SILVER,
        value: 10
    }
];

export const FORE_BAND = [
    BASE,
    BASE,
    MULTIPLIER,
    TOLERANCE
];
