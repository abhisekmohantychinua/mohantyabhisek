# Website Schema Organization

## Purpose

This document standardizes how structured data (JSON-LD), schema entities, and schema relationships are implemented across the website.

The objectives are:

- Maintain a consistent schema architecture.
- Avoid duplicate entity definitions.
- Ensure all pages participate in a connected schema graph.
- Define how new content types should be integrated.
- Define how FAQ schema should be generated.
- Establish conventions for future schema additions.

---

# Core Principles

## 1. Single Source of Truth

Global entities must have a single canonical definition and identifier.

These entities should be reused throughout the website using `@id` references rather than recreated on every page.

Example:

```json
{
  "@id": "https://mohantyabhisek.com/#person"
}
```

---

## 2. Graph-Based Schema Design

Schemas should be connected through relationships rather than existing as isolated objects.

Prefer:

```json
{
  "publisher": {
    "@id": "https://mohantyabhisek.com/#organization"
  }
}
```

Instead of repeatedly defining:

```json
{
  "@type": "Organization",
  "name": "Abhisek"
}
```

on every page.

---

## 3. Schema Must Reflect Visible Content

Only generate structured data for information that is actually present on the page.

Examples:

- Visible FAQs → Generate FAQPage schema.
- No FAQ section → Do not generate FAQPage schema.
- Visible blog article → Generate BlogPosting schema.
- Visible work/case study → Generate CreativeWork schema.

---

## 4. Schema Generated From Content Models

Structured data should be derived from content entities.

Examples:

- Blog → BlogPosting
- FAQ[] → FAQPage
- Work → CreativeWork

Avoid manually maintaining separate schema content.

---

# Global Entities

These entities represent the permanent identity of the website.

---

## Person

### Canonical ID

```txt
https://mohantyabhisek.com/#person
```

### Type

```txt
Person
```

### Usage

Referenced by:

- BlogPosting.author
- CreativeWork.creator
- Contact Page
- Future content authored by Abhisek

---

## Organization

### Canonical ID

```txt
https://mohantyabhisek.com/#organization
```

### Type

```txt
Organization
```

### Usage

Referenced by:

- Website publisher
- Blog publisher
- Work publisher
- Future content publishers

---

## Website

### Canonical ID

```txt
https://mohantyabhisek.com/#website
```

### Type

```txt
WebSite
```

### Usage

Referenced by:

- Collection pages
- Blog posts
- Work pages
- Future content collections

---

# Current Schema Architecture

## Home Page

### Schemas

```txt
Organization
WebSite
```

### Relationships

```txt
WebSite
└── publisher → Organization

Organization
└── founder → Person
```

---

## Contact Page

### Schema

```txt
Person
```

### Relationships

```txt
Person
└── worksFor → Organization
```

---

## Blog Listing Page

### Schema

```txt
CollectionPage
ItemList
```

### Relationships

```txt
CollectionPage
├── isPartOf → WebSite
├── publisher → Organization
└── mainEntity → ItemList
```

---

## Blog Detail Page

### Schema

```txt
BlogPosting
```

### Relationships

```txt
BlogPosting
├── author → Person
├── publisher → Organization
├── isPartOf → CollectionPage
├── isPartOf → WebSite
└── mainEntityOfPage → WebPage
```

---

## Blog FAQ Schema

### Schema

```txt
FAQPage
```

### Source

Generated from:

```ts
blog.faqs
```

### Rules

Generate FAQPage only when FAQs are rendered on the page.

---

# Work Schema Standard

## Recommended Schema Type

```txt
CreativeWork
```

A Work represents:

- Case Study
- Portfolio Project
- Client Project
- Internal Product
- Showcase Project

CreativeWork is the most appropriate Schema.org type.

---

## Relationships

```txt
CreativeWork
├── creator → Person
├── publisher → Organization
├── isPartOf → WebSite
└── mainEntityOfPage → WebPage
```

---

## Suggested Mapping

| Work Field | Schema Property |
|------------|----------------|
| title | name |
| description | description |
| postedAt | datePublished |
| lastModifiedAt | dateModified |
| sectors | about |
| images | image |

---

## FAQ Support

If a Work contains FAQs:

```txt
Work
└── FAQs
```

Generate:

```txt
FAQPage
```

using the same approach as blog pages.

---

# Future Schema Expansion Process

Whenever a new content type is introduced:

## Step 1

Identify the primary Schema.org type.

Examples:

```txt
BlogPosting
CreativeWork
CollectionPage
Person
Organization
Service
```

---

## Step 2

Determine relationships.

Examples:

```txt
author
creator
publisher
isPartOf
mainEntityOfPage
worksFor
```

---

## Step 3

Reuse existing global entities.

Prefer:

```json
{
  "@id": "https://mohantyabhisek.com/#person"
}
```

instead of redefining entities.

---

## Step 4

Determine whether FAQPage is needed.

Rules:

- FAQs visible → Generate FAQPage.
- FAQs absent → Do not generate FAQPage.

---

## Step 5

Add the page to the schema graph.

Every new schema should connect to one or more existing entities.

Examples:

```txt
Service
└── provider → Organization

CreativeWork
└── creator → Person

BlogPosting
└── author → Person
```

---

# Current Schema Graph

```txt
Person
│
├── BlogPosting
│
├── CreativeWork
│
└── Contact Page


Organization
│
├── WebSite
├── BlogPosting
├── CreativeWork
└── Contact Page


WebSite
│
├── CollectionPage
├── BlogPosting
└── CreativeWork


BlogPosting
└── FAQPage


CreativeWork
└── FAQPage
```

This graph should remain the foundation for all future structured data implementations on the website.
