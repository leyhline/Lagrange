---
title: "Proof of Equivalence for Wrong Solution to WhatsApp Chain Letter"
tags: [proof, mathematics]
caption: "The infamous chain letter as received on 23 November 2018 by a good friend of mine. Traditionally with disgusting compression artifacts and formatting."
---

<blockquote>
<p>Find the right solution. Never forget mathematics are always correct :ok_hand:</p>

<p>
1+4 =5<br>
2+5=12<br>
3+6=21<br>
5+8=.....
</p>

<p>If you answer wrong you must write this to your status.</p>
</blockquote>

Well, it's not really addition, therefore I'll be using \\( +_\omega \\) instead.
If you think some time about it you will surely arrive at the solution¹:

<p>
\begin{equation}
    5 +_\omega 8 = 45
\end{equation}
</p>

A (different) friend got this, too. When talking with him how he did it, he said he just added the values to the previous result.
This is the recursive solution my friend noticed, I just formalized it for \\( x, y \in \mathbb{N} \\):
<p>
\begin{equation}
    x +_\omega y = \begin{cases}
        0                              & \text{if } x=0 \\
        ((x-1) +_\omega (y-1)) + x + y & \text{otherwise}
    \end{cases}
\end{equation}
</p>

Naturally, I got the same result. But I found another approach (using the slightly different \\( +_\Omega \\) here).
This is my closed-form solution for all \\( x \leq y \\) (which implicitly follows from the recursive solution):
<p>
\begin{equation}
    x +_\Omega y = xy + x
\end{equation}
</p>

Now, I'd like to show that \\( +\_\omega \\) and \\( +\_\Omega \\) really work the same way. Do both really produce the same result for all possible combinations of \\(x \\) and \\( y \\)?

Fortunately, this can be done by simple [induction](https://en.wikipedia.org/wiki/Mathematical_induction) which is a really cool proof technique. To show that something holds for every natural number one just needs to prove that:

1. It holds for a base number, in our case \\( x=0 \\).
2. It holds for every next number: Let's use \\( x+1 \\) and \\( y+1 \\) here because the recursive solution is build around the pattern that both get incremented at the same rate.

Okay, let's rock! Most of the time, the base step is really easy. Just set \\( x=0 \\) and it's basically done.

<p>
\begin{align}
    0 +_\omega y &= 0 \\
    0 +_\Omega y = 0y + 0 &= 0
\end{align}
</p>

Alright, both results match for \\( x=0 \\).
Let's assume it's the same for all natural numbers and let's call this our *inductive hypothesis* (*ih*).
But to really be sure we need to do the *inductive step*. This is usually more involved but here it's luckily just setting \\( x=x+1 \\) and \\( y=y+1 \\) and doing some rearranging.

<p>
\begin{align}
     &(x+1) +_\omega (y+1) \\
    =& ((x+1-1) +_\omega (y+1-1)) + (x+1) + (y+1) \\
    =& (x +_\omega y) + x + y + 2 \\
    \overset{ih}{=}& (x +_\Omega y) + x + y + 2 \\
    =& (xy + x) + x + y + 2 \\
    =& xy + 2x + y + 2 \\
    =& (x+1)(y+1) + (x+1) \\
    =& (x+1) +_\Omega (y+1)
\end{align}
</p>

At *ih* we're using the *inductive hypothesis* because we know there is at least one \\( x \\) where the results match. This is something we showed at the base step. So why not assume we're just one step above exactly this \\( x \\) in our *inductive step*. Following this logic and with some recursive magic we'll always arrive at the base step, no matter which values we plug in. *QED*

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/layton.png" alt="Professor Layton solves a puzzle">
    <figcaption style="text-align:center;">
    Professor Layton solves a puzzle © Nintendo
    </figcaption>
</figure>

Okay, a real mathematician™ would laugh his ass off if he saw me calling this a *proof*.
But either way, if we want to know the result of, let's say… \\( 8,567,479,662,374,590 +\_\omega 8,567,479,662,374,593 \\) then we don't need to do ten quadrillion calculations, we can instead do just one calculation of \\( 8,567,479,662,374,590 +\_\Omega 8,567,479,662,374,593 \\) instead and be sure that we've got an identical result. Wow!

<hr>

¹Punchline: Needless to say, this answer is wrong since there's a catch, as one could easily have expected. Obviously, the "right solution" is 1+4=5.
