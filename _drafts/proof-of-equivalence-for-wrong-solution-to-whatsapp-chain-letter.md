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

The recursive solution my friend noticed, formalized by me for \\( x, y \in \mathbb{N} \\):
<p>
\begin{align}
    0 +_\omega y &= 0 \\
    x +_\omega y &= ((x-1) +_\omega (y-1)) + x + y \\
\end{align}
</p>

My closed-form solution for all \\( x \leq y \\) (which implicitly follows from the recursive solution):
<p>
\begin{equation}
    x +_\Omega y = xy + x
\end{equation}
</p>

Now, I'd like to show that \\( +\_\omega \\) and \\( +\_\Omega \\) really work the same way. Do both really produce the same result for all possible combinations of \\(x \\) and \\( y \\)?

Fortunately, this can be done by simple [induction](https://en.wikipedia.org/wiki/Mathematical_induction) which is a really cool proof technique. To show that something holds for every natural number one just needs to proof that:

1. It holds for a base number, in our case \\( x=0 \\).
2. It holds for every next number: Let's use \\( x+1 \\) and \\( y+1 \\) here because the recursive solution is build around this pattern.

Okay, let's rock! The base step is most of the time really easy. Just set \\( x=0 \\) and it's basically done.

<p>
\begin{align}
    0 +_\omega y &= 0 \\
    0 +_\Omega y = 0y + 0 &= 0
\end{align}
</p>

Now for the inductive step. This is usually more involved but here it's luckily just setting \\( x=x+1 \\) and \\( y=y+1 \\) and doing some rearranging.

<p>
\begin{align}
     &(x+1) +_\omega (y+1) \\
    =& ((x+1-1) +_\omega (y+1-1)) + (x+1) + (y+1) \\
    =& (x +_\omega y) + x + y + 2 \\
    =& (xy + x) + x + y + 2 \\
    =& xy + 2x + y + 2 \\
    =& (x+1)(y+1) + (x+1) \\
    =& (x+1) +_\Omega (y+1) & \square \\
\end{align}
</p>
