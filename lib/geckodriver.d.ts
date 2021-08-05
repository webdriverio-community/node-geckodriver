/// <reference types="node" />

import { ChildProcess } from 'child_process';

export const path: string;
export const version: string;

export function start(args?: ReadonlyArray<string>): ChildProcess;

export function stop(): void;

export const defaultInstance: ChildProcess | undefined;
