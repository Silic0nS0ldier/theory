/**
 * Workload shapes. Sizes are chosen so a framework's fixed cost can be separated from its
 * per-file and per-test cost by comparing cells rather than by trusting any single number.
 */
export type Scenario = {
    readonly id: string,
    readonly files: number,
    readonly testsPerFile: number,
    readonly async: boolean,
};

export const scenarios: readonly Scenario[] = [
    { id: "minimal", files: 1, testsPerFile: 1, async: false },
    { id: "wide", files: 50, testsPerFile: 1, async: false },
    { id: "deep", files: 1, testsPerFile: 50, async: false },
    { id: "typical", files: 20, testsPerFile: 10, async: false },
    { id: "typical-async", files: 20, testsPerFile: 10, async: true },
];

export function totalTests(scenario: Scenario): number {
    return scenario.files * scenario.testsPerFile;
}
