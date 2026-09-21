/**
 * @author Raj Sheth
 * created: 11/03/24
 */

export class VkycAlreadyUnderProcessError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = "VkycAlreadyUnderProcessError";
  }
}
