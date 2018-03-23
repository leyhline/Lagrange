---
title: "Book Review: Clean Code"
tags: [book, programming, review]
caption: "The Small Drawing-Room: Mme Hessel at Her Sewing Table (1917) by Édouard Vuillard"
---

Following up on my last book review I'd like to go a bit more into technical details this time by writing about *Clean Code*. On the one hand this is a well-known book by Robert C. Martin (nicknamed Uncle Bob), on the other hand this is a concept about writing maintainable and easy to read code. These are widespread ideas in programming and by simply searching one can find lots of blogs, explanations, initiatives etc. There are even some articles that claim that this is [THE book every programmer should read](https://hackernoon.com/the-book-every-programmer-should-read-33b5ef2e532a).

I just started out with my first job but I did a lot of programming during my time at university. I also read about some concepts and had lectures with given coding styles and style checkers and all that stuff. My grades were good and I had the feeling that I was a better programmer than most of my fellow students. Still, I had the feeling that I was lacking something in general. This book helped me realize! Now I just have to implement these lessons in my day job (punchline at the end).

## The book

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/book_cover.jpg" alt="Book cover of Clean Code" style="min-width:60%;border:1px solid black;border-radius:0;">
    <figcaption>Full name of the book: Clean Code — A Handbook of Agile Software Craftsmanship</figcaption>
</figure>

The book's from 2009 and has 462 pages in total. Its catchphrase is:

>Writing clean code is what you must do in order to call yourself a professional.
>There is no reasonable excuse for doing anything less than your best.

There are 17 chapters. The first chapters is about the definition of clean code and some introductory musings. Chapter 2 to 13 contains all the advice with examples and explanations. Up to chapter 16 it's about successive refinement — one of the core principles — by example and last but not least (I always wanted to use this phrase!) chapter 17 contains a long overview over possible code smells. Nice!

### Opinion

It hurts my inner contrarian but I have to agree with the consensus: **this is a must read**. Before, I thought I was so clever and gifted. Now I feel dumb. That's perfect! I love this feeling! And what's most impressive: This book isn't about complicated and abstract ideas. It's about the uninspired technical parts of programming. It's written to be useful. Nevertheless, it changed the way I look at code. Might be my lacking experience but I'm deeply impressed such a book could affect me this much.

Of course this doesn't mean one has to agree with everything. I'm still no clean code zealot. (I think?)

## Case study

Okay, now we all know this book is great and stuff. Of course, I could now write about the content but there the book is full of good advice and it would be best to read it yourself or check out some videos from [cleancoders.com](https://cleancoders.com/). But I thought it would be interesting to try some techniques on my own code.

I present you: The original video game [**Vagram's Vicious Vengeance**](https://github.com/sopra05/V3). This is the result of a semester long group project I had to do at university in 2016.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/screenshot.jpg" alt="In-game screenshot of the game">
    <figcaption>In-game screenshot of the game; you control a necromancer and massacre everyone in the kingdom. We got a very good grade for this one.</figcaption>
</figure>

My main contribution was the interface for the moving units: The humans, the undead and the necromancer himself. This includes their representation in code, displaying and movement. 
For the latter I wrote the [PlayerMovement class](https://github.com/sopra05/V3/blob/master/V3/Objects/Movement/PlayerMovement.cs). It came out quite nicely considering my experience.
[I can't say the same for all my classes](https://github.com/sopra05/V3/blob/master/V3/Objects/AbstractCreature.cs) but especially for game development [the end product is more important than the underlying implementation](https://godotengine.org/article/how-actually-make-your-dream-game). Most games are simply too short-lived to justify successive refinement. But it's a nice exercise so let's start!

This is the original code:

<button onclick="toggleCode(0)" class="toggle">Show Code</button>

```csharp
// TODO: Rename the class. Current name is unfitting. (But what is fitting?)
/// <summary>
/// Movement scheme for moving an object with the pathfinder.
/// </summary>
public class PlayerMovement : IMovable
{
    private const int CellHeight = Constants.CellHeight;
    private const int CellWidth = Constants.CellWidth;
    private const float SpeedModifier = 0.25f;

    private List<Vector2> mPath;
    private int mStep;
    private Vector2 mLastMovement;

    public bool IsMoving { get; private set; }

    /// <summary>
    /// Calculates a path without collisions to desired destination.
    /// </summary>
    /// <param name="pathfinder">Pathfinder to use.</param>
    /// <param name="position">Current position in pixel.</param>
    /// <param name="destination">Destination in pixel.</param>
    public void FindPath(Pathfinder pathfinder, Vector2 position, Vector2 destination)
    {
        mStep = 0;
        mPath = pathfinder.FindPath(new Vector2((int)(position.X / CellWidth), (int)(position.Y / CellHeight)),
            new Vector2((int)(destination.X / CellWidth), (int)(destination.Y / CellHeight)));
        IsMoving = mPath.Count > 0;
    }

    /// <summary>
    /// Uses pathfinder to for steady movement to new transition.
    /// </summary>
    /// <param name="currentPosition">Current position in pixel.</param>
    /// <param name="speed">Movement speed of the creature.</param>
    /// <returns>Normalized vector * speed which represents a small step in the direction of desired destination.(</returns>
    public virtual Vector2 GiveNewPosition(Vector2 currentPosition, int speed)
    {
        Vector2 nextPosition = mPath[mStep];
        Vector2 newPosition = nextPosition - currentPosition;
        newPosition.Normalize();
        float distanceToDestination = Vector2.Distance(nextPosition, currentPosition);
        if (distanceToDestination < SpeedModifier * speed)
        {
            if (mStep == mPath.Count - 1)
            {
                IsMoving = false;
            }
            else
            {
                mStep++;
            }
        }
        mLastMovement = newPosition;
        return newPosition * SpeedModifier * speed;
    }

    /// <summary>
    /// Calculates the direction the creature is looking when moving.
    /// </summary>
    public MovementDirection GiveMovementDirection()
    {
        //   |\
        //   |α\        α == 22.5°
        //  b|  \ 1     β == 67.5°
        //   |  β\
        //   ──────
        //     a
        const float b = 0.92f;  // b == sin β
        const float a = 0.38f;  // a == sin α
        Vector2 direction = mLastMovement;
        MovementDirection movementDirection;
        if (direction.X < -b)
        {
            movementDirection = MovementDirection.W;
        }
        else if (direction.X > b)
        {
            movementDirection = MovementDirection.O;
        }
        else if (direction.Y > 0)
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.SW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.SO;
            }
            else
            {
                movementDirection = MovementDirection.S;
            }
        }
        else
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.NW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.NO;
            }
            else
            {
                movementDirection = MovementDirection.N;
            }
        }
        return movementDirection;
    }
}
``` 

### Step 1

Okay, right at the beginning it a *TODO* comment recommending renaming of the class. At first I wanted this only for the player but at the end all ground-moving units used this class (and we only had ground-moving units.)

So let's rename the class first to **GroundMovement**. Furthermore, the books recommends being *very* sparing with comments and docstrings. The rationale is, that often one forgets to update comments on changes. It's better to *Explain Yourself in Code*. So let's try removing the comments and take a look if it's still readable.

<button onclick="toggleCode(2)" class="toggle">Show Code</button>

```csharp
public class GroundMovement : IMovable
{
    private const int CellHeight = Constants.CellHeight;
    private const int CellWidth = Constants.CellWidth;
    private const float SpeedModifier = 0.25f;

    private List<Vector2> mPath;
    private int mStep;
    private Vector2 mLastMovement;

    public bool IsMoving { get; private set; }

    public void FindPath(Pathfinder pathfinder,
                         Vector2 position,
                         Vector2 destination)
    {
        mStep = 0;
        mPath = pathfinder.FindPath(new Vector2((int)(position.X / CellWidth), (int)(position.Y / CellHeight)),
            new Vector2((int)(destination.X / CellWidth), (int)(destination.Y / CellHeight)));
        IsMoving = mPath.Count > 0;
    }

    public virtual Vector2 GiveNewPosition(Vector2 currentPosition,
                                           int speed)
    {
        Vector2 nextPosition = mPath[mStep];
        Vector2 newPosition = nextPosition - currentPosition;
        newPosition.Normalize();
        float distanceToDestination = Vector2.Distance(nextPosition, currentPosition);
        if (distanceToDestination < SpeedModifier * speed)
        {
            if (mStep == mPath.Count - 1)
            {
                IsMoving = false;
            }
            else
            {
                mStep++;
            }
        }
        mLastMovement = newPosition;
        return newPosition * SpeedModifier * speed;
    }

    public MovementDirection GiveMovementDirection()
    {
        //   |\
        //   |α\        α == 22.5°
        //  b|  \ 1     β == 67.5°
        //   |  β\
        //   ──────
        //     a
        const float b = 0.92f;  // b == sin β
        const float a = 0.38f;  // a == sin α
        Vector2 direction = mLastMovement;
        MovementDirection movementDirection;
        if (direction.X < -b)
        {
            movementDirection = MovementDirection.W;
        }
        else if (direction.X > b)
        {
            movementDirection = MovementDirection.O;
        }
        else if (direction.Y > 0)
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.SW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.SO;
            }
            else
            {
                movementDirection = MovementDirection.S;
            }
        }
        else
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.NW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.NO;
            }
            else
            {
                movementDirection = MovementDirection.N;
            }
        }
        return movementDirection;
    }
}
``` 

Who needs lines like `<param name="pathfinder">Pathfinder to use.</param>` anyway? But I didn't remove my nice triangle where I tried to explain my calculations since we used isometric perspective.

### Step 2

Okay, there was some information lost! We have `position` parameters but since we have two coordinate systems — cells and pixels — we don't know the exact meaning from the code alone. Let's change this to `pixelPosition`. (The same for `destination` and similar parameters.)

```csharp
public class GroundMovement : IMovable
{
    private const int CellHeight = Constants.CellHeight;
    private const int CellWidth = Constants.CellWidth;
    private const float SpeedModifier = 0.25f;

    private List<Vector2> mPath;
    private int mStep;
    private Vector2 mLastMovement;

    public bool IsMoving { get; private set; }

    public void FindPath(Pathfinder pathfinder,
                         Vector2 pixelPosition,
                         Vector2 pixelDestination)
    {
        mStep = 0;
        mPath = pathfinder.FindPath(new Vector2((int)(position.X / CellWidth), (int)(position.Y / CellHeight)),
            new Vector2((int)(destination.X / CellWidth), (int)(destination.Y / CellHeight)));
        IsMoving = mPath.Count > 0;
    }

    public virtual Vector2 GiveNewPosition(Vector2 currentPixelPosition,
                                           int speed)
    {
        Vector2 nextPosition = mPath[mStep];
        Vector2 newPosition = nextPosition - currentPosition;
        newPosition.Normalize();
        float distanceToDestination = Vector2.Distance(nextPosition, currentPosition);
        if (distanceToDestination < SpeedModifier * speed)
        {
            if (mStep == mPath.Count - 1)
            {
                IsMoving = false;
            }
            else
            {
                mStep++;
            }
        }
        mLastMovement = newPosition;
        return newPosition * SpeedModifier * speed;
    }

    public MovementDirection GiveMovementDirection()
    {
        //   |\
        //   |α\        α == 22.5°
        //  b|  \ 1     β == 67.5°
        //   |  β\
        //   ──────
        //     a
        const float b = 0.92f;  // b == sin β
        const float a = 0.38f;  // a == sin α
        Vector2 direction = mLastMovement;
        MovementDirection movementDirection;
        if (direction.X < -b)
        {
            movementDirection = MovementDirection.W;
        }
        else if (direction.X > b)
        {
            movementDirection = MovementDirection.O;
        }
        else if (direction.Y > 0)
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.SW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.SO;
            }
            else
            {
                movementDirection = MovementDirection.S;
            }
        }
        else
        {
            if (direction.X < -a)
            {
                movementDirection = MovementDirection.NW;
            }
            else if (direction.X > a)
            {
                movementDirection = MovementDirection.NO;
            }
            else
            {
                movementDirection = MovementDirection.N;
            }
        }
        return movementDirection;
    }
}
``` 

### Why I fucked this one up

## Punchline: Clean Code in Industry

After finishing this book I was eager to start writing clean code and I was hoping to learn from industry professionals about good object-oriented design, flexible software architecture, efficient team work. Well… even if these can not be learned from books alone I realized that pure practical experience does not necessarily teach about these things either. Could've stayed at university at this rate. :suspect: