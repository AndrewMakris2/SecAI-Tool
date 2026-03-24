/**
 * Barrel file that combines both question halves into a single exported array.
 * Split into two files to keep individual files manageable.
 */
import { questionsPart1 } from './questions-part1';
import { questionsPart2 } from './questions-part2';
import type { Question } from '@/types';

export const questions: Question[] = [...questionsPart1, ...questionsPart2];

export default questions;
