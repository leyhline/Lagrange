---
title: "Book Review: Clean Code"
tags: [book, programming, review]
caption: "The Small Drawing-Room: Mme Hessel at Her Sewing Table (1917) by Édouard Vuillard"
---
<style>div.highlight { display: none; }</style>
<script src="{{ site.baseurl }}{% link /assets/js/utilities.js %}" async></script>

Following up on my last book review I'd like to go a bit more into technical details this time by writing about *Clean Code*. On the one hand this is a well-known book by Robert C. Martin (nicknamed Uncle Bob), on the other hand this is a concept about writing maintainable and easy to read code. These are widespread ideas in programming and by simply doing a search on term one can find lots of blogs, explanations, initiatives etc. There are even some articles that claim that this is [THE book every programmer should read](https://hackernoon.com/the-book-every-programmer-should-read-33b5ef2e532a).

I just started out with my first job but I did a lot of programming during my time at university. I also read about some concepts and had lectures with given coding styles and style checkers and all that stuff. My grades were good and I think I was a better programmer than most of my fellow students. Still, I had the feeling that I was lacking something in general. This book helped me realize! Now I just have to implement these lessons in my day job (punchline at the end).

## The book

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/book_cover.jpg" alt="Book cover of Clean Code" style="min-width:60%;border:1px solid black;border-radius:0;">
    <figcaption>Full name of the book: Clean Code — A Handbook of Agile Software Craftsmanship</figcaption>
</figure>

The book's from 2009 and has 462 pages in total. Its catchphrase is:

>Writing clean code is what you must do in order to call yourself a professional.
>There is no reasonable excuse for doing anything less than your best.

There are 17 chapters. The first chapter is about the definition of clean code and some introductory musings. Chapters 2 to 13 contain all the advice with examples and explanations. Up to chapter 16 it's about successive refinement — one of the core principles — by example and last but not least (I always wanted to use this phrase!) chapter 17 contains a long overview over possible code smells. Nice!

### Opinion

It hurts my inner contrarian but I have to agree with the consensus: **this is a must read**. Before, I thought I was so clever and gifted. Now I feel dumb. That's perfect! I love this feeling! And what's most impressive: This book isn't about complicated and abstract ideas. It's about the uninspired technical parts of programming. It's written to be useful. Nevertheless, it changed the way I look at code. Might be my lacking experience but I'm deeply impressed such a book could affect me this much.

Of course this doesn't mean one has to agree with everything. I'm still no clean code zealot. (I think?)

## Case study

Okay, now we all know this book is great and stuff. Of course, I could now write about the content but the book is full of good advice and it would be best to read it yourself or check out some videos from [cleancoders.com](https://cleancoders.com/). Therefore, I thought it would be interesting to try some techniques on my own code.

I present you: The original video game [**Vagram's Vicious Vengeance**](https://github.com/sopra05/V3). This is the result of a semester long group project I had to do at university in 2016.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/screenshot.jpg" alt="In-game screenshot of the game">
    <figcaption>In-game screenshot of the game; you control a necromancer and massacre everyone in the kingdom. We got a very good grade for this.</figcaption>
</figure>

My main contribution were the classes for moving units: The humans, the undead and the necromancer himself. This includes their representation in code, displaying and movement. 
For the latter I wrote the [PlayerMovement class](https://github.com/sopra05/V3/blob/master/V3/Objects/Movement/PlayerMovement.cs). It came out quite nicely considering my experience.
[I can't say the same for all my classes](https://github.com/sopra05/V3/blob/master/V3/Objects/AbstractCreature.cs) but especially in game development [the end product is more important than the underlying implementation](https://godotengine.org/article/how-actually-make-your-dream-game). Most games are simply too short-lived to justify successive refinement. But it's a nice exercise so let's start!

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
                IsMoving = false;
            else
                mStep++;
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
                movementDirection = MovementDirection.SW;
            else if (direction.X > a)
                movementDirection = MovementDirection.SO;
            else
                movementDirection = MovementDirection.S;
        }
        else
        {
            if (direction.X < -a)
                movementDirection = MovementDirection.NW;
            else if (direction.X > a)
                movementDirection = MovementDirection.NO;
            else
                movementDirection = MovementDirection.N;
        }
        return movementDirection;
    }
}
``` 

### Step 1: Removing redundant comments

Okay, right at the beginning is a *TODO* comment recommending renaming the class. At first, I wanted to use this only for the player but at the end all ground-moving units used this class (and we only had ground-moving units.)

First, let's rename the class to **GroundMovement**. Furthermore, the book recommends being *very* sparing with comments and docstrings. The rationale is, that often one forgets to update comments on changes. It's better to *Explain Yourself in Code*. So let's try removing the comments and take a look if it's still readable.

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
                IsMoving = false;
            else
                mStep++;
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
                movementDirection = MovementDirection.SW;
            else if (direction.X > a)
                movementDirection = MovementDirection.SO;
            else
                movementDirection = MovementDirection.S;
        }
        else
        {
            if (direction.X < -a)
                movementDirection = MovementDirection.NW;
            else if (direction.X > a)
                movementDirection = MovementDirection.NO;
            else
                movementDirection = MovementDirection.N;
        }
        return movementDirection;
    }
}
``` 

Who needs lines like `<param name="pathfinder">Pathfinder to use.</param>` anyway? But I didn't remove my nice triangle where I tried to explain my calculations since we used isometric perspective.

### Step 2: Working on variables

Okay, there was some information lost! We have `position` parameters but since we have two coordinate systems — cells and pixels — we don't know the exact meaning from the code alone. Let's change this to `pixelPosition`. (The same for `destination` and similar parameters.)

Furthermore, in the `FindPath` method there's this statement: `mPath = pathfinder.FindPath(new Vector2((int)(position.X / CellWidth), (int)(position.Y / CellHeight)), new Vector2((int)(destination.X / CellWidth), (int)(destination.Y / CellHeight)));` I have no idea what this means and I get a headache just reading it. Might be best to split this up using local variables.

<button onclick="toggleCode(4)" class="toggle">Show Code</button>

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
        Vector2 start = new Vector2((int)(pixelPosition.X / CellWidth), (int)(pixelPosition.Y / CellHeight));
        Vector2 goal = new Vector2((int)(pixelDestination.X / CellWidth), (int)(pixelDestination.Y / CellHeight)));
        mPath = pathfinder.FindPath(start, goal);
        IsMoving = mPath.Count > 0;
    }

    public virtual Vector2 GiveNewPosition(Vector2 currentPixelPosition,
                                           int speed)
    {
        Vector2 nextPosition = mPath[mStep];
        Vector2 newPosition = nextPosition - currentPixelPosition;
        newPosition.Normalize();
        float distanceToDestination = Vector2.Distance(nextPosition, currentPixelPosition);
        if (distanceToDestination < SpeedModifier * speed)
        {
            if (mStep == mPath.Count - 1)
                IsMoving = false;
            else
                mStep++;
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
                movementDirection = MovementDirection.SW;
            else if (direction.X > a)
                movementDirection = MovementDirection.SO;
            else
                movementDirection = MovementDirection.S;
        }
        else
        {
            if (direction.X < -a)
                movementDirection = MovementDirection.NW;
            else if (direction.X > a)
                movementDirection = MovementDirection.NO;
            else
                movementDirection = MovementDirection.N;
        }
        return movementDirection;
    }
}
```

### Step 3: Working on methods

Up till now I thought methods and functions were mainly for avoiding repetition and maybe splitting responsibilities. Readability was only an afterthought. But now I realized that this is equally important for writing maintainable code. Sure, an additional method call might be deemed unneccessary, but we're not doing low-level system programming where this matters. Besides, the compiler might inline some methods anyway.

So let's first introduce a new method `PixelToCellCoordinate` (using a new C# 7 feature for multiple returns; simply using a Tuple is also possible). This method is only used in the `FindPath` method. Ultimately, it's the same principle as learning in school's writing class: Many short sentences are easier to understand than a single nested one.

Another interesting part is *One Level of Abstraction per Function*. All statements should be at the same level of abstraction. In the `GiveNewPosition` method there is this large conditional `if` block and it's really hard for me to remember what's happening here. I shouldn't need to remember. Whoever reads this should understand what's happening from the code alone. So we introduce a new method just for this single part: `StopMovementOrAdvance`.

<button onclick="toggleCode(6)" class="toggle">Show Code</button>

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
        (int cellPositionX, int cellPositionY) = PixelToCellCoordinate(pixelPosition);
        Vector2 start = new Vector2(cellPositionX, cellPositionY);
        (int cellDestinationX, int cellDestinationY) = PixelToCellCoordinate(pixelDestination);
        Vector2 goal = new Vector2(cellDestinationX, cellDestinationY);
        mPath = pathfinder.FindPath(start, goal);
        IsMoving = mPath.Count > 0;
    }

    private (int, int) PixelToCellCoordinate(Vector2 pixelCoordinate)
    {
        return ((int)(pixelPosition.X / CellWidth),
                (int)(pixelPosition.Y / CellHeight));
    }

    public virtual Vector2 GiveNewPosition(Vector2 currentPixelPosition,
                                           int speed)
    {
        Vector2 nextPosition = mPath[mStep];
        Vector2 newPosition = nextPosition - currentPixelPosition;
        newPosition.Normalize();
        float distanceToDestination = Vector2.Distance(nextPosition, currentPixelPosition);
        if (distanceToDestination < SpeedModifier * speed)
        {
            StopMovementOrAdvance();
        }
        mLastMovement = newPosition;
        return newPosition * SpeedModifier * speed;
    }

    private void StopMovementOrAdvance()
    {
        if (mStep == mPath.Count - 1)
            IsMoving = false;
        else
            mStep++;
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
                movementDirection = MovementDirection.SW;
            else if (direction.X > a)
                movementDirection = MovementDirection.SO;
            else
                movementDirection = MovementDirection.S;
        }
        else
        {
            if (direction.X < -a)
                movementDirection = MovementDirection.NW;
            else if (direction.X > a)
                movementDirection = MovementDirection.NO;
            else
                movementDirection = MovementDirection.N;
        }
        return movementDirection;
    }
}
```

There are still many problems left where methods need to be changed: `GiveNewPosition` has side effects; it does more than one expects. 
And `GiveMovementDirection` is simply ugly.

### Why I fucked this one up

Even though I might have improved the readability slightly I made a grave mistake. Before refactoring the code it's important to write tests. After refactoring the code it's important to adjust the tests. And this needs to be repeated after every single refactoring, always checking if the code's still working correctly. Programming is complex stuff — especially when you do this 8+ hours a day — and there's no need trying to be clever.

Obviously, there is much, much more advice. Like trying to write short functions, short classes and never ask for more than three parameters. And I won't start on the architectural and methodical parts.

## Punchline: Clean Code in Industry

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/the_triumph_of_death.jpg" alt="The Triumph of Death">
    <figcaption>
    The Triumph of Death (1562) by Pieter Bruegel the Elder<br>This is only a small section. I recommend checking out <a href="https://pixabay.com/en/oil-painting-death-classical-1178909/">the whole painting</a>.
    This painting inspired the game but additionally also describes my first experience with code quality in industry. What a coincidence!
    </figcaption>
</figure>

After finishing this book I was eager to start writing clean code and I was hoping to learn from industry professionals about good object-oriented design, flexible software architecture, efficient team work. Well… even if these can not be learned from books alone I realized that pure practical experience does not necessarily teach about these things either. Could've stayed at university at this rate. :suspect: