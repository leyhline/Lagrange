---
title: "Lean Code, Lean Art, Lean Everything"
tags: [methodologies, 3D, blender, lean]
caption: "Some ugly render of a chess board (2018) by myself"
---

Sorry for the ugly cover image. I'm currently attending an [online course](https://www.udemy.com/blendertutorial/) for [Blender](https://www.blender.org/) (open-source software for creating 3D graphics) and this is the first asset I made that's not a complete failure. Hope I can later look back and laugh at myself, whatever the reason for my amusement might be.

Since I am working full-time now for the past few months I am thinking a lot about methodologies. The work itself isn't really challenging on an intellectual level. It doesn't even compare to the academic problems I faced at university. So what's more interesting now are:
* working with others
* managing time and workload
* designing my stuff for ease of use (my stuff is used by other developers, not the end user, nevertheless they prefer nice tooling, I assume)
* integration with existing tools 
* etc.

By comparison, these problems are still quite dull but it's better than nothing. I read lots of books and articles about this stuff (moreover, I have an BA in Business Administration as well as some work experience in this field but that's nothing to be proud of) and now it's a good opportunity to try some of these methodical frameworks and evaluate their usefulness for my current position. I'm just a small cog in the system but better running these experiments sooner than later when it really matters. It's unfortunate that I have to do these experiments myself but the problem with most business books is that they are similar to autobiographies: At the end, everything works out. But what you read is just part of the whole story. Anecdotes. In reality, people and companies (which are incidentally made of people) are just too different and simply transferring these experiences to different situations won't necessarily work out. Nevertheless, I believe there are some general rules to discover. 

From the many buzzwordy methodologies there is one I really grew to like. You may have guessed it already — no, not *Scrum* — but I talk about *Lean*. Or is it *lean* with a lowercase *l*? Even though it's called *Lean*, the capital *L* version seems to be quite bloated by now. But if I understand correctly, the original idea was simply to reduce *waste* (jap. 無駄 muda).

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/muda.jpg" alt="JoJo’s Bizarre Adventure, Part 3: Stardust Crusaders by Hirohiko Araki">
    <figcaption>
    JoJo’s Bizarre Adventure, Part 3: Stardust Crusaders by Hirohiko Araki © Shueisha<br>
    This is one possibility how to deal with waste.
    </figcaption>
</figure>

One of its implementations is the *Kanban Board* where you visually track your tasks in categories. In the basic version you move your tasks between "To Do", "In Progress" and "Done". But it's best to be creative and adjust it to your own needs. Overall, I try to be lean when implementing lean for myself:

* Think about what really needs to be done.
* Don't solve problems you don't have.
* If possible, use existing solutions so you don't solve the same problem twice. (the hard part is to know about them)
* Prefer to finish a task before starting the next.

And the best part is: Right when I started reading about lean I encountered it everywhere: I read about founding your own startup: "Lean Startup". I did the above mentioned Blender course: Lean Production, iteratively improving the created models. At the end of the day it's still an ill-defined buzzword. If it doesn't work out you can — as always — say: "You just did it wrong!" But there is some elegance in the idea itself and I hope I can get to the bottom of its success.

In this context, even this blog entry is some kind of conclusion to my studies about existing methodologies, now launching the next phase and collecting data.

## How lean helped me to deal with the aftermath of Clean Code

I already wrote about [how totally dank Martin's Clean Code is]({{ site.baseurl }}{% post_url 2018-03-23-clean-code %}). But after finishing the book I had problems with my personal programming projects. I also wanted to have a nice and simple class structure, clear names and a self-explanatory interface. All supplied with a set of tests for all edge cases. **But!** But I was thinking so much about this stuff, I couldn't get any functionality done. And when I was done many hours later I realized I made a mistake and had to rework my whole architecture. I'm aware, that's not what Uncle Bob intended with his advice. He even said that the key is continuous refactoring. But still, I was blocked.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/objects_on_a_table.jpg" alt="Objects on a Table (ca. 1920–21) by Patrick Henry Bruce">
    <figcaption>
    Objects on a Table (ca. 1920–21) by Patrick Henry Bruce <br>
    Another approach I took away from the Blender course is to start with abstract geometrical forms (that's a given), step by step improving the model and saving intermediate results. At the end you will have lots of prototypes with varying detail you can select from. Isn't this painting also some kind of prototype for all the still lives we've got to see over the years?
    </figcaption>
</figure>

Then, I read about lean, do everything lean, write lean, lean prototypes, even lean tests, leanleanleandaldenaslaenaelan. And the magic of buzzwords worked and suddenly I wrote all this stuff down, got it working first and only afterwards improved style and architecture, given that I was satisfied with the functionality. Words are such abstract little things. But their power is unbelievably terrifying.