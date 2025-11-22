export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static InsertASlug(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalized as a slug.
   *
   * Example: "It Doesn't matter" => "it-doesnt-matter"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
