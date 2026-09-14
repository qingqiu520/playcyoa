// Waffo content-safety prompt scan — required for AIGC products.
// Docs: https://docs.waffo.ai/zh/api-reference/endpoints/content-safety/scan-prompt
// Verdicts: "allow" -> generate; "review" -> try later; "block" -> refuse.
// If WAFFO credentials are not configured (local dev), scanning is skipped.

import { ScanSemanticMode, WaffoPancake } from "@waffo/pancake-ts";

export type SafetyAction = "allow" | "review" | "block";

export async function scanPromptSafety(prompt: string): Promise<SafetyAction> {
  const merchantId = process.env.WAFFO_MERCHANT_ID;
  const privateKey = process.env.WAFFO_PRIVATE_KEY;
  if (!merchantId || !privateKey) return "allow";

  const client = new WaffoPancake({ merchantId, privateKey });
  try {
    const verdict = await client.contentSafety.scanPrompt({
      prompt,
      locale: "en",
      semantic: ScanSemanticMode.Enforce,
    });
    return (verdict?.action as SafetyAction) || "review";
  } catch {
    // Scan service unreachable — fail closed per Waffo guidance.
    return "review";
  }
}
