---
title: "Creating a Vagrant Base Box (from Fedora 29 Server, using Libvirt as Provider)"
tags: [virtualization, vm, vagrant, libvirt, qemu, kvm, fedora]
caption: "Wayfarers Looking at the Statue of Jizo Bosatsu in a Pine Grove at Hashiba (ca. 1840) by Utagawa Kuniyoshi"
---

Virtual machines are nice for playing around with different operating systems[^linux], software setups and network configurations. But they are a pain to install and after using them for some time it's hard to remember all the steps that were necessary to get the machine to behave in desirable way. This lack of reproducibility isn't very *scientific*! Wouldn't it be nice to have some kind of specification – human readable, but also executable – for quickly creating VMs in a matter of seconds?
This is something [Vagrant](https://www.vagrantup.com/) promises to do (in combination with some other tool for provisioning like [Ansible](https://www.ansible.com/)).

[^linux]: i.e. Linux distributions; how could I ever bear using Windows if it wasn't absolutely necessary?

There's also [a large number of base images available](https://app.vagrantup.com/boxes/search) so getting started just takes three commands. So far so good! Now, I've got some extravagant expectations:

* I'd like to use a current version of [Fedora Server](https://getfedora.org/en/server/) (presently 29) because of its up-to-date repositories and built-in SELinux support.
* Since my host is also Linux my obvious choice for running VMs is [QEMU](https://www.qemu.org/)/[KVM](https://www.linux-kvm.org/) (Kernel-based Virtual Machine) with hardware acceleration: I'll use Vagrant's [libvirt provider](https://github.com/vagrant-libvirt/vagrant-libvirt).
* And maybe I'm just a control freak.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/vm-stack.png" alt="Icons of VM stack">
    <figcaption>My virtualization stack. I especially like QEMU's logo, even though design-wise it's a bit banal.</figcaption>
</figure>