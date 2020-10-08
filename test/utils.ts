import { expect } from "chai";
import { BaseSerializable } from "../types/Base";

type Bufferish = string | Uint8Array | Buffer | BaseSerializable;

function toHex(bytes: Bufferish): string {
  if (typeof bytes === "string") return bytes;
  if (bytes instanceof Uint8Array) return Buffer.from(bytes).toString("hex");
  if (typeof bytes.serialize === "function")
    return Buffer.from(bytes.serialize()).toString("hex");
  throw Error("Unknown arg");
}

export function expectHex(value: Bufferish, expected: Bufferish): void {
  expect(toHex(value)).to.equal(toHex(expected));
}

export function fromHex(hexString: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

/**
 * Enforce tests for all instance methods
 */
export type InstanceTestCases<InstanceType extends { [key: string]: any }> = {
  [P in keyof InstanceType]: {
    id?: string;
    instance?: InstanceType;
    args: Parameters<InstanceType[P]>;
    res: ReturnType<InstanceType[P]>;
  }[];
};

/**
 * Enforce tests for all instance methods and run them
 */
export function runInstanceTestCases<
  InstanceType extends { [key: string]: any }
>(
  instanceTestCases: InstanceTestCases<InstanceType>,
  getInstance: () => InstanceType
) {
  for (const [key, testCases] of Object.entries(instanceTestCases)) {
    const methodKey = key as keyof InstanceType;
    describe(String(methodKey), () => {
      for (const testCase of testCases) {
        it(testCase.id || "test", () => {
          // Get a new fresh instance for this test
          const instance = testCase.instance || getInstance();
          if (typeof instance[methodKey] !== "function")
            throw Error(`Method ${methodKey} does not exist`);
          const res = (instance[methodKey] as any)(...testCase.args);
          if (res.serialize || res instanceof Uint8Array) {
            expectHex(res, testCase.res);
          } else {
            expect(res).to.deep.equal(testCase.res);
          }
        });
      }
    });
  }
}
