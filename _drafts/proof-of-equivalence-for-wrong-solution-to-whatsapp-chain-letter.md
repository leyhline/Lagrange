---
title: "Proof of Equivalence for Wrong Solution to WhatsApp Chain Letter"
tags: [proof, mathematics]
caption: "The infamous chain letter as received on 23 November 2018 by a good friend of mine. Traditionally with disgusting compression artifacts and formatting."
---

<blockquote>
<p>Find the right solution. Don't forget, mathematics are always correct. :ok_hand:</p>

<p>
1+4=5<br>
2+5=12<br>
3+6=21<br>
4+5=…
</p>

<p>If you answer wrong you must write this to your status.</p>
</blockquote>

The recursive solution my friend noticed, formalized by me:
<p>
    $$x, y \in \mathbb{N}$$
    $$ 0 +_\omega y = 0 $$
    $$x +_\omega y = ((x-1) +_\omega (y-1)) + x + y$$
</p>

My closed-form solution for all <span>$$x \leq y$$</span> (which implicitly follows from the recursive solution):
<p>
    $$x +_\Omega y = xy + x$$
</p>

Now, I'd like to show that <span>$$+_\omega$$< and $$+_\Omega$$</span> really work the same way. Do both really produce the same result for all possible combinations of <span>$$x$$ and $$y$$</span>?

Fortunately, this can be done by simple [induction](https://en.wikipedia.org/wiki/Mathematical_induction) which is a really cool proof technique. To show that something holds for every natural number one just needs to proof that:

1. It holds for a base number, in our case <span>$$x=0$$</span>.
2. It holds for every next number: <span>$$x+1$$ and $$y+1$$</span> (maybe I need to further differentiate between cases, I still need to think about this)