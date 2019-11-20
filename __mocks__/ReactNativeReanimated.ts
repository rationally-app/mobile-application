/**
 * Adapted from https://github.com/software-mansion/react-native-reanimated/blob/master/mock.js
 *
 * Using that implementation causes issues when components do a setValue on an Animated.Value.
 * ```ts
 * const v = new Animated.Value<number>(0);
 * v.setValue(1); // TypeError: v.setValue is not a function
 * ```
 */

import React from "react";
import { View, Text, Image, Animated } from "react-native";

const NOOP = (): null => null;

export const Easing = {
  linear: NOOP,
  ease: NOOP,
  quad: NOOP,
  cubic: NOOP,
  poly: () => NOOP,
  sin: NOOP,
  circle: NOOP,
  exp: NOOP,
  elastic: () => NOOP,
  back: () => NOOP,
  bounce: () => NOOP,
  bezier: () => NOOP,
  in: () => NOOP,
  out: () => NOOP,
  inOut: () => NOOP
};

export default {
  SpringUtils: {
    makeDefaultConfig: NOOP,
    makeConfigFromBouncinessAndSpeed: NOOP,
    makeConfigFromOrigamiTensionAndFriction: NOOP
  },
  View,
  Text,
  Image,
  ScrollView: Animated.ScrollView,
  Code: () => ({
    render: NOOP
  }),

  Clock: NOOP,
  Node: NOOP,
  Value: () => ({
    setValue: NOOP
  }),

  Extrapolate: {
    EXTEND: "extend",
    CLAMP: "clamp",
    IDENTITY: "identity"
  },

  add: NOOP,
  sub: NOOP,
  multiply: NOOP,
  divide: NOOP,
  pow: NOOP,
  modulo: NOOP,
  sqrt: NOOP,
  log: NOOP,
  sin: NOOP,
  cos: NOOP,
  tan: NOOP,
  acos: NOOP,
  asin: NOOP,
  atan: NOOP,
  exp: NOOP,
  round: NOOP,
  floor: NOOP,
  ceil: NOOP,
  lessThan: NOOP,
  eq: NOOP,
  greaterThan: NOOP,
  lessOrEq: NOOP,
  greaterOrEq: NOOP,
  neq: NOOP,
  and: NOOP,
  or: NOOP,
  defined: NOOP,
  not: NOOP,
  set: NOOP,
  concat: NOOP,
  cond: NOOP,
  block: NOOP,
  call: NOOP,
  debug: NOOP,
  onChange: NOOP,
  startClock: NOOP,
  stopClock: NOOP,
  clockRunning: NOOP,
  event: NOOP,
  abs: NOOP,
  acc: NOOP,
  color: NOOP,
  diff: NOOP,
  diffClamp: NOOP,
  interpolate: NOOP,
  max: NOOP,
  min: NOOP,

  decay: NOOP,
  timing: NOOP,
  spring: NOOP,

  proc: () => NOOP,

  useCode: NOOP,
  createAnimatedComponent: (component: React.Component) => React.Component
};
