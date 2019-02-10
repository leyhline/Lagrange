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
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/vm-stack.png" alt="Icons of Virtualization Stack">
    <figcaption>My virtualization stack. I especially like QEMU's logo, even though design-wise it's a bit banal.</figcaption>
</figure>

* TOC
{:toc}

## Step 1: Create the VM and install Fedora

Because I'm lazy I'm using the [`virt-manager`](https://virt-manager.org/) GUI to quickly create a VM from the [Fedora Server Net-Install ISO](https://getfedora.org/en/server/download/).

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-2-iso-selection.png" alt="Step 2: Selecting the ISO Image">
</figure>

When creating the VM, let's mostly follow [Vagrant's advice](https://www.vagrantup.com/docs/boxes/base.html#memory):

> Like disk space, finding the right balance of the default amount of memory is important. For most providers, the user can modify the memory with the Vagrantfile, so do not use too much by default. It would be a poor user experience (and mildly shocking) if a vagrant up from a base box instantly required many gigabytes of RAM. Instead, choose a value such as **512MB**, which is usually enough to play around and do interesting things with a Vagrant machine, but can easily be increased when needed.

Since Fedora is kinda bloated better choose **1024 MB** for RAM. With lower values the installation crashed for me. [This corresponds with Fedora's official minimum requirements, too.](https://docs.fedoraproject.org/en-US/fedora/f29/release-notes/welcome/Hardware_Overview/#hardware_overview-specs)

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-3-ram.png" alt="Step 3: Selecting initial RAM and CPUs">
</figure>

> Disable any non-necessary hardware in a base box such as audio and USB controllers. These are generally unnecessary for Vagrant usage and, again, can be easily added via the Vagrantfile in most cases.

This is optional since you can also do this later.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-5-final.png" alt="Step 5: Customize configuration before install">
    <figcaption>Check “Customize configuration before install” to configure/remove hardware.</figcaption>
</figure>

Next, start up the VM and step through the installation process. This is straightforward for Fedora since everything is GUI-based. We're not installing Arch or Gentoo, after all. As for all the settings (user name, password, root password) I just put "vagrant" everywhere.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-useradd.png" alt="Adding the “vagrant” user">
    <figcaption>Just write “vagrant” in every field. It might be a weak password but <a href="https://www.vagrantup.com/docs/boxes/base.html#quot-vagrant-quot-user">it's an approved standard</a>.</figcaption>
</figure>

## Step 2: Configure the Operating System for Vagrant

Again, we just follow [Vagrant's documentation](https://www.vagrantup.com/docs/boxes/base.html#default-user-settings). But not without empathizing this paragraph:

> If you are creating a base box for private use, you should try not to follow these, as they open up your base box to security risks (known users, passwords, private keys, etc.).

Yes, since we're building our own box it would be much safer to not follow the defaults and and configure the box in a more unique way. Then again, we could simply change all settings afterwards during provisioning. 

### Configure SSH Access

> This user (vagrant) should be setup with the [insecure keypair](https://github.com/hashicorp/vagrant/tree/master/keys) that Vagrant uses as a default to attempt to SSH.

Let's do this! Download the key files on your host and copy them over to your VM.

```
$ wget https://raw.githubusercontent.com/hashicorp/vagrant/master/keys/vagrant
$ wget https://raw.githubusercontent.com/hashicorp/vagrant/master/keys/vagrant.pub
$ ssh-copy-id -i vagrant.pub vagrant@192.168.122.233
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "vagrant.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
vagrant@192.168.122.233's password: 

Number of key(s) added: 1
```

Of course your guest VM's IP address will most likely be different.

### Password-less Sudo

Let's connect with our VM using SSH. At the same time we check if installing the key worked.

```
$ chmod 0600 vagrant
$ ssh -i vagrant vagrant@192.168.122.233
```

Hopefully, we're now connected. Let's edit sudo's configuration by first changing to root, then opening the config file with the `visudo` helper command.

```
$ su
Password:
$ visudo
```

I hope you're proficient with Vim. :wink: At the end of the just opened sudo configuration file write:

```
vagrant ALL=(ALL) NOPASSWD: ALL
```

### Disable DNS lookup

This is optional, but recommended in the [documentation](https://www.vagrantup.com/docs/boxes/base.html#ssh-tweaks):

> In order to keep SSH speedy even when your machine or the Vagrant machine is not connected to the internet, set the `UseDNS` configuration to `no` in the SSH server configuration.

You can do this in the SSH server's configuration:

```
$ vi /etc/ssh/sshd_config
```

At last you can disconnect and shut down the VM.

## Step 3: Creating the Box

For creating the Vagrant box itself let's look at [the documentation of the Vagrant Libvirt Provider](https://github.com/vagrant-libvirt/vagrant-libvirt#vagrant-libvirt-provider).

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/3-libvirt-provider.png" alt="Github page of the Libvirt Provider" style="border:1px solid black;border-radius:0;">
    <figcaption>Seems perfectly reliable.</figcaption>
</figure>

At the bottom of the README there's a section about [Creating a Box](https://github.com/vagrant-libvirt/vagrant-libvirt#create-box). Apparently, there is a helper script `create_box.sh` in the repository. Let's move to the folder holding or `qcow2` image and call this script.

```
$ wget https://raw.githubusercontent.com/vagrant-libvirt/vagrant-libvirt/master/tools/create_box.sh
$ ./create_box.sh
Usage: ./create_box.sh IMAGE [BOX] [Vagrantfile.add]

Package a qcow2 image into a vagrant-libvirt reusable box
$ ./create_box.sh fedora-server-29-1.2.qcow2
==> Creating box, tarring and gzipping
./metadata.json
./Vagrantfile
./box.img
Total bytes written: 2491525120 (2.4GiB, 33MiB/s)
==> fedora-server-29-1.2.box created
==> You can now add the box:
==>   'vagrant box add fedora-server-29-1.2.box --name fedora-server-29-1.2'
```

Ta-da! Your newly created `fedora-server-29-1.2.box` is ready! Let's try it out!

Create a new folder somewhere, add and start your box:

```
$ vagrant box add fedora/29-server /var/lib/libvirt/images/fedora-server-29-1.2.box
==> box: Box file was not detected as metadata. Adding it directly...
==> box: Adding box 'fedora/29-server' (v0) for provider: 
    box: Unpacking necessary files from: file:///home/leyht/Projekte/libvirt-images/fedora-server-29-1.2.box
==> box: Successfully added box 'fedora/29-server' (v0) for 'libvirt'!
$ vagrant init fedora/29-server
$ vagrant up
...
$ vagrant ssh
```

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/virt-manager-overview.png" alt="Vagrant Box in virt-manager">
    <figcaption>We can also see libvirt Vagrant boxes in virt-manager.</figcaption>
</figure>