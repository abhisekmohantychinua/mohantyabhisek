import { render } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

const { registerPluginMock, useGSAPMock, customEaseCreateMock } = vi.hoisted(
  () => ({
    registerPluginMock: vi.fn(),
    useGSAPMock: vi.fn(),
    customEaseCreateMock: vi.fn(),
  }),
);

vi.mock("gsap", () => ({
  default: {
    registerPlugin: registerPluginMock,
  },
}));

vi.mock("@gsap/react", () => ({
  useGSAP: useGSAPMock,
}));

vi.mock("gsap/CustomEase", () => ({
  CustomEase: {
    create: customEaseCreateMock,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

import GSAPInit from "./index";

describe("GSAPInit", () => {
  test("registers gsap plugins on module initialization", (): void => {
    expect(registerPluginMock).toHaveBeenCalledTimes(1);
  });

  test("calls useGSAP when rendered", (): void => {
    render(<GSAPInit />);

    expect(useGSAPMock).toHaveBeenCalledTimes(1);
  });

  test("creates materialEase when useGSAP callback runs", (): void => {
    useGSAPMock.mockImplementation((callback: () => void): void => callback());

    render(<GSAPInit />);

    expect(customEaseCreateMock).toHaveBeenCalledWith(
      "materialEase",
      "M0,0 C0.4,0 0.2,1 1,1",
    );
  });

  test("renders nothing", (): void => {
    const { container } = render(<GSAPInit />);

    expect(container.firstChild).toBeNull();
  });
});
