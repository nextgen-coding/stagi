// Script to seed a sample HTML learning path
// Run with: npx tsx scripts/seed-html-learning-path.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating HTML Learning Path...')

  // Create the learning path
  const learningPath = await prisma.learningPath.create({
    data: {
      title: 'HTML Fundamentals',
      description: 'Master the basics of HTML - the foundation of web development. Learn to structure web pages with semantic elements, forms, tables, and multimedia.',
      estimatedDays: 7,
      isActive: true
    }
  })
  console.log(`✓ Created Learning Path: ${learningPath.title}`)

  // Module 1: Introduction to HTML
  const module1 = await prisma.module.create({
    data: {
      learningPathId: learningPath.id,
      title: 'Introduction to HTML',
      description: 'Get started with HTML basics - understand what HTML is and how web pages are structured.',
      orderIndex: 0,
      estimatedHours: 2
    }
  })
  console.log(`  ✓ Created Module: ${module1.title}`)

  // Task 1.1
  const task1_1 = await prisma.task.create({
    data: {
      moduleId: module1.id,
      title: 'What is HTML?',
      description: 'Learn what HTML is and why it is the foundation of all web pages.',
      orderIndex: 0,
      isRequired: true,
      estimatedMinutes: 15
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task1_1.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# What is HTML?

**HTML** stands for **HyperText Markup Language**. It is the standard language used to create and structure content on web pages.

## Key Points

- HTML is **not** a programming language - it's a *markup* language
- HTML uses **tags** to define elements on a page
- Every website you visit uses HTML as its foundation
- HTML works together with CSS (styling) and JavaScript (interactivity)

## A Brief History

HTML was created by **Tim Berners-Lee** in 1991. Since then, it has evolved through several versions:

1. HTML 1.0 (1991)
2. HTML 2.0 (1995)
3. HTML 4.01 (1999)
4. XHTML (2000)
5. **HTML5** (2014) - Current standard

## Why Learn HTML?

- It's the foundation of web development
- Every web developer needs to know HTML
- It's relatively easy to learn
- Opens doors to learning CSS and JavaScript`
      },
      {
        taskId: task1_1.id,
        contentType: 'VIDEO',
        orderIndex: 1,
        videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE'
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task1_1.title}`)

  // Task 1.2
  const task1_2 = await prisma.task.create({
    data: {
      moduleId: module1.id,
      title: 'Your First HTML Document',
      description: 'Create your first HTML document and understand its basic structure.',
      orderIndex: 1,
      isRequired: true,
      estimatedMinutes: 20
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task1_2.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# Your First HTML Document

Every HTML document follows a basic structure. Let's create your first web page!

## The Basic Structure

Every HTML document needs these essential parts:`
      },
      {
        taskId: task1_2.id,
        contentType: 'CODE',
        orderIndex: 1,
        textContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>`
      },
      {
        taskId: task1_2.id,
        contentType: 'TEXT',
        orderIndex: 2,
        textContent: `## Breaking It Down

- \`<!DOCTYPE html>\` - Tells the browser this is an HTML5 document
- \`<html>\` - The root element of the page
- \`<head>\` - Contains metadata about the document
- \`<title>\` - Sets the page title (shown in browser tab)
- \`<body>\` - Contains all visible content

## Exercise

1. Create a new file called \`index.html\`
2. Copy the code above into the file
3. Open the file in your web browser
4. Try changing the text inside the \`<h1>\` and \`<p>\` tags`
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task1_2.title}`)

  // Module 2: HTML Elements
  const module2 = await prisma.module.create({
    data: {
      learningPathId: learningPath.id,
      title: 'Essential HTML Elements',
      description: 'Learn the most commonly used HTML elements for structuring content.',
      orderIndex: 1,
      estimatedHours: 3
    }
  })
  console.log(`  ✓ Created Module: ${module2.title}`)

  // Task 2.1
  const task2_1 = await prisma.task.create({
    data: {
      moduleId: module2.id,
      title: 'Headings and Paragraphs',
      description: 'Learn how to use heading and paragraph elements to structure text content.',
      orderIndex: 0,
      isRequired: true,
      estimatedMinutes: 15
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task2_1.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# Headings and Paragraphs

Headings and paragraphs are the building blocks of text content on the web.

## Headings

HTML provides six levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):`
      },
      {
        taskId: task2_1.id,
        contentType: 'CODE',
        orderIndex: 1,
        textContent: `<h1>Main Title (h1)</h1>
<h2>Section Title (h2)</h2>
<h3>Subsection Title (h3)</h3>
<h4>Sub-subsection (h4)</h4>
<h5>Minor heading (h5)</h5>
<h6>Smallest heading (h6)</h6>`
      },
      {
        taskId: task2_1.id,
        contentType: 'TEXT',
        orderIndex: 2,
        textContent: `## Paragraphs

The \`<p>\` element defines a paragraph:`
      },
      {
        taskId: task2_1.id,
        contentType: 'CODE',
        orderIndex: 3,
        textContent: `<p>This is a paragraph of text. It can contain multiple sentences.</p>

<p>This is another paragraph. Each paragraph starts on a new line with space above and below.</p>`
      },
      {
        taskId: task2_1.id,
        contentType: 'TEXT',
        orderIndex: 4,
        textContent: `## Best Practices

- Use only **one** \`<h1>\` per page (usually for the main title)
- Don't skip heading levels (don't jump from \`<h2>\` to \`<h4>\`)
- Use headings to create a logical document outline
- Keep paragraphs focused on a single topic`
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task2_1.title}`)

  // Task 2.2
  const task2_2 = await prisma.task.create({
    data: {
      moduleId: module2.id,
      title: 'Links and Images',
      description: 'Add interactivity with links and visual content with images.',
      orderIndex: 1,
      isRequired: true,
      estimatedMinutes: 20
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task2_2.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# Links and Images

Links and images are essential for creating engaging web content.

## The Anchor Tag (Links)

The \`<a>\` tag creates hyperlinks to other pages:`
      },
      {
        taskId: task2_2.id,
        contentType: 'CODE',
        orderIndex: 1,
        textContent: `<!-- Basic link -->
<a href="https://www.example.com">Visit Example.com</a>

<!-- Open in new tab -->
<a href="https://www.example.com" target="_blank">Open in New Tab</a>

<!-- Link to another page on your site -->
<a href="about.html">About Us</a>

<!-- Link to a section on the same page -->
<a href="#section-id">Jump to Section</a>`
      },
      {
        taskId: task2_2.id,
        contentType: 'TEXT',
        orderIndex: 2,
        textContent: `## The Image Tag

The \`<img>\` tag embeds images. It's a **self-closing** tag:`
      },
      {
        taskId: task2_2.id,
        contentType: 'CODE',
        orderIndex: 3,
        textContent: `<!-- Basic image -->
<img src="photo.jpg" alt="A descriptive text">

<!-- Image with dimensions -->
<img src="photo.jpg" alt="Description" width="300" height="200">

<!-- Image from the web -->
<img src="https://example.com/image.png" alt="Online image">`
      },
      {
        taskId: task2_2.id,
        contentType: 'TEXT',
        orderIndex: 4,
        textContent: `## Important Attributes

**For Links:**
- \`href\` - The URL to link to (required)
- \`target="_blank"\` - Opens link in new tab
- \`title\` - Tooltip text on hover

**For Images:**
- \`src\` - The image source URL (required)
- \`alt\` - Alternative text for accessibility (required)
- \`width\` / \`height\` - Dimensions in pixels`
      },
      {
        taskId: task2_2.id,
        contentType: 'LINK',
        orderIndex: 5,
        linkTitle: 'MDN Web Docs - HTML Links',
        linkUrl: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks'
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task2_2.title}`)

  // Task 2.3
  const task2_3 = await prisma.task.create({
    data: {
      moduleId: module2.id,
      title: 'Lists in HTML',
      description: 'Learn to create ordered and unordered lists.',
      orderIndex: 2,
      isRequired: true,
      estimatedMinutes: 15
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task2_3.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# Lists in HTML

HTML provides three types of lists for organizing content.

## Unordered Lists

Use \`<ul>\` for bullet point lists:`
      },
      {
        taskId: task2_3.id,
        contentType: 'CODE',
        orderIndex: 1,
        textContent: `<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ul>`
      },
      {
        taskId: task2_3.id,
        contentType: 'TEXT',
        orderIndex: 2,
        textContent: `## Ordered Lists

Use \`<ol>\` for numbered lists:`
      },
      {
        taskId: task2_3.id,
        contentType: 'CODE',
        orderIndex: 3,
        textContent: `<ol>
    <li>Step one</li>
    <li>Step two</li>
    <li>Step three</li>
</ol>`
      },
      {
        taskId: task2_3.id,
        contentType: 'TEXT',
        orderIndex: 4,
        textContent: `## Exercise

Create a shopping list using an unordered list, and a recipe with numbered steps using an ordered list.`
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task2_3.title}`)

  // Module 3: Semantic HTML
  const module3 = await prisma.module.create({
    data: {
      learningPathId: learningPath.id,
      title: 'Semantic HTML5',
      description: 'Learn to use semantic elements for better accessibility and SEO.',
      orderIndex: 2,
      estimatedHours: 2
    }
  })
  console.log(`  ✓ Created Module: ${module3.title}`)

  // Task 3.1
  const task3_1 = await prisma.task.create({
    data: {
      moduleId: module3.id,
      title: 'Semantic Elements',
      description: 'Understand and use HTML5 semantic elements.',
      orderIndex: 0,
      isRequired: true,
      estimatedMinutes: 25
    }
  })
  await prisma.taskContent.createMany({
    data: [
      {
        taskId: task3_1.id,
        contentType: 'TEXT',
        orderIndex: 0,
        textContent: `# Semantic HTML5 Elements

Semantic elements clearly describe their meaning to both the browser and developers.

## Why Use Semantic HTML?

- **Accessibility**: Screen readers can navigate content better
- **SEO**: Search engines understand your content structure
- **Maintainability**: Code is easier to read and maintain

## Key Semantic Elements`
      },
      {
        taskId: task3_1.id,
        contentType: 'CODE',
        orderIndex: 1,
        textContent: `<header>
    <!-- Site header, navigation, logo -->
</header>

<nav>
    <!-- Navigation links -->
</nav>

<main>
    <!-- Main content of the page -->
    
    <article>
        <!-- Self-contained content (blog post, news article) -->
    </article>
    
    <section>
        <!-- Thematic grouping of content -->
    </section>
    
    <aside>
        <!-- Sidebar content -->
    </aside>
</main>

<footer>
    <!-- Site footer, copyright, contact info -->
</footer>`
      },
      {
        taskId: task3_1.id,
        contentType: 'VIDEO',
        orderIndex: 2,
        videoUrl: 'https://www.youtube.com/watch?v=kGW8Al_cga4'
      }
    ]
  })
  console.log(`    ✓ Created Task: ${task3_1.title}`)

  console.log('\n✅ HTML Learning Path created successfully!')
  console.log(`   Learning Path ID: ${learningPath.id}`)
  console.log(`   Total Modules: 3`)
  console.log(`   Total Tasks: 6`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
