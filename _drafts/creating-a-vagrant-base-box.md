---
title: "Creating a Vagrant Base Box (from Fedora 29 Server, using Libvirt as Provider)"
tags: [virtualization, vm, vagrant, libvirt, qemu, kvm, fedora]
caption: "Wayfarers Looking at the Statue of Jizo Bosatsu in a Pine Grove at Hashiba (ca. 1840) by Utagawa Kuniyoshi"
---

Virtual machines are nice for playing around with different operating systems[^linux], software setups and network configurations. But they are a pain to install and after using them for some time it's hard to remember all the steps that were necessary to get the machine to its current state. This lack of reproducibility isn't very *scientific*! Wouldn't it be nice to have some kind of specification — human readable, but also executable — for quickly creating VMs in a matter of seconds?
This is something [Vagrant](https://www.vagrantup.com/) promises to do (in combination with some tool for provisioning like [Ansible](https://www.ansible.com/)).

[^linux]: Personally, I prefer different Linux distributions. Wouldn't want to use Windows if it isn't necessary.

There're also [numerous base images available](https://app.vagrantup.com/boxes/search) so getting started just takes three commands. So far so good! Now, I've got some extravagant expectations:

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

We'll be mainly using the [`virt-manager`](https://virt-manager.org/) GUI because I'm lazy. But wait! This will do some kind of metadata preallocation when creating the VM image, resulting in a really large file on the host system.[^preallocation] There's no way to change this from the GUI, so we first need to create the storage using the command line. Let's take a look at `man qemu-img`:

[^preallocation]: Actually, it's a bit more complicated. With metadata preallocation the image files won't actually use up the disk space but when reading the file attributes (with e.g. `ls -l`) the given size is displayed.

> "preallocation"
>
> Preallocation mode (allowed values: "off", "metadata", "falloc", "full"). An image with preallocated metadata is initially larger but can improve performance when the image needs to grow.

Okay, we just need to create an image with preallocation turned off:

```
$ qemu-img create -f qcow2 -o preallocation=off fedora-server-29.qcow2 20G
Formatting 'fedora-server-29.qcow2', fmt=qcow2 size=21474836480 cluster_size=65536 preallocation=off lazy_refcounts=off refcount_bits=16
$ ls -gGh fedora-server-29.qcow2
-rw-r--r-- 1 193K Feb 11 21:21 fedora-server-29.qcow2
```

Just 193 kB! Nice. Now we can download the [Fedora Server Net-Install ISO](https://getfedora.org/en/server/download/) and click together our virtual machine with `virt-manager`. 

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-1-importiso.png" alt="Step 2: Using an ISO image">
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-2-iso-selection.png" alt="Step 3: Selecting the ISO Image">
    <figcaption>Select the ISO disk image you got from <a href="https://getfedora.org/">getfedora.org</a>.</figcaption>
</figure>

When creating the VM, let's mostly follow [Vagrant's advice](https://www.vagrantup.com/docs/boxes/base.html#memory):

> Like disk space, finding the right balance of the default amount of memory is important. For most providers, the user can modify the memory with the Vagrantfile, so do not use too much by default. It would be a poor user experience (and mildly shocking) if a vagrant up from a base box instantly required many gigabytes of RAM. Instead, choose a value such as **512MB**, which is usually enough to play around and do interesting things with a Vagrant machine, but can easily be increased when needed.

Since Fedora is kinda bloated, better choose **1024 MB** for RAM. With lower values the installation crashed for me. [This corresponds with Fedora's official minimum requirements, too.](https://docs.fedoraproject.org/en-US/fedora/f29/release-notes/welcome/Hardware_Overview/#hardware_overview-specs)

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-3-ram.png" alt="Step 3: Selecting initial RAM and CPUs">
    <figcaption>For Fedora, you need 1024 MB RAM at minimum.</figcaption>
</figure>

For storage, we'll be using the `qcow2` image file we created above.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-4-storage.png" alt="Step 4: Select the storage image">
    <figcaption>Select the formerly created storage image.</figcaption>
</figure>

> Disable any non-necessary hardware in a base box such as audio and USB controllers. These are generally unnecessary for Vagrant usage and, again, can be easily added via the Vagrantfile in most cases.

This is optional since you can also do this later.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-5-final.png" alt="Step 5: Customize configuration before install">
    <figcaption>Check “Customize configuration before install” to configure/remove hardware.</figcaption>
</figure>

Next, we simply start up the VM and step through the installation process. This is straightforward for Fedora since everything is GUI-based. We're not installing Arch or Gentoo, after all. As for all the settings (user name, password, root password) let's just put "vagrant" everywhere.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/1-useradd.png" alt="Adding the “vagrant” user">
    <figcaption>Just write “vagrant” in every field. It might be a weak password but <a href="https://www.vagrantup.com/docs/boxes/base.html#quot-vagrant-quot-user">it's an approved standard</a>.</figcaption>
</figure>

## Step 2: Configure the Operating System for Vagrant

Again, we just follow [Vagrant's documentation](https://www.vagrantup.com/docs/boxes/base.html#default-user-settings). But not without empathizing this paragraph:

> If you are creating a base box for private use, you should try not to follow these, as they open up your base box to security risks (known users, passwords, private keys, etc.).

Yes, since we're building our own box it would be much safer to not follow the defaults and configure the box in a more unique way. Then again, we could simply change all settings afterwards during provisioning. 

### Configure SSH Access

> This user (vagrant) should be setup with the [insecure keypair](https://github.com/hashicorp/vagrant/tree/master/keys) that Vagrant uses as a default to attempt to SSH.

Let's do this! Downloading the key files and copying them over to the VM.

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

Hopefully, we're now connected. Let's edit sudo's configuration by first switching to root, then opening the config file with the `visudo` helper command.

```
$ su
Password:
$ visudo
```

I hope you're proficient with Vim. :wink: Adding this to the end of the just opened sudo configuration file:

```
vagrant ALL=(ALL) NOPASSWD: ALL
```

### Disable DNS lookup

This is optional, but recommended in the [documentation](https://www.vagrantup.com/docs/boxes/base.html#ssh-tweaks):

> In order to keep SSH speedy even when your machine or the Vagrant machine is not connected to the internet, set the `UseDNS` configuration to `no` in the SSH server configuration.

This is just a minor edit in the SSH server's configuration file.

```
$ vi /etc/ssh/sshd_config
```

At last, disconnect and shut down the VM. This is also the last chance to remove unnecessary hardware from the VM.

## Step 3: Creating the Box

For creating the Vagrant box itself let's look at [the documentation of the Vagrant Libvirt Provider](https://github.com/vagrant-libvirt/vagrant-libvirt#vagrant-libvirt-provider).

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/3-libvirt-provider.png" alt="Github page of the Libvirt Provider" style="border:1px solid black;border-radius:0;">
    <figcaption>Seems perfectly reliable.</figcaption>
</figure>

At the bottom of the README there's a section about [Creating a Box](https://github.com/vagrant-libvirt/vagrant-libvirt#create-box). Apparently, there is a helper script `create_box.sh` in the repository which simply creates a default `Vagrantfile` and a short `metadata.json` and packs them together with the VM image. Easy, isn't it? Move to the folder holding the `qcow2` image and call the script.

```
$ wget https://raw.githubusercontent.com/vagrant-libvirt/vagrant-libvirt/master/tools/create_box.sh
$ ./create_box.sh
Usage: ./create_box.sh IMAGE [BOX] [Vagrantfile.add]

Package a qcow2 image into a vagrant-libvirt reusable box
$ ./create_box.sh fedora-server-29.qcow2
{20}
==> Creating box, tarring and gzipping
./metadata.json
./Vagrantfile
./box.img
Total bytes written: 2438277120 (2.3GiB, 32MiB/s)
==> fedora-server-29.box created
==> You can now add the box:
==>   'vagrant box add fedora-server-29.box --name fedora-server-29'
```

Ta-da! Our newly created `fedora-server-29.box` is ready! Let's try it out!

After creating a new folder somewhere, add and start the box:

```
$ vagrant box add leyhline/fedora-server-29 fedora-server-29.box
==> box: Box file was not detected as metadata. Adding it directly...
==> box: Adding box 'leyhline/fedora-server-29' (v0) for provider:
==> box: Successfully added box 'leyhline/fedora-server-29' (v0) for 'libvirt'!
$ vagrant init leyhline/fedora-server-29
$ vagrant up
...
$ vagrant ssh
$ echo Hello, $USER!
Hello, vagrant!
```

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/virt-manager-overview.png" alt="Vagrant Box in virt-manager">
    <figcaption>Libvirt Vagrant boxes can be seen in virt-manager, too.</figcaption>
</figure>

I took the liberty of uploading our box to Vagrant Cloud: [leyhline/fedora-server-29](https://app.vagrantup.com/leyhline/boxes/fedora-server-29)

### Side Node: Synced folders with NFS

By default, Vagrant will share the current directory with the guest VM using NFS (Network File System). But when running a firewall this will most likely fail. Now, we've got three options:

1. Adjusting the firewall: There is some information on the [Fedora Developer Portal](https://developer.fedoraproject.org/tools/vagrant/vagrant-nfs.html) on adding rules with `firewall-cmd`.
2. Using a different protocol: Instead of NFS, we can also [use VirtFS or rsync](https://github.com/vagrant-libvirt/vagrant-libvirt#synced-folders).
3. Disabling synced folders altogether: This is my choice since I currently don't need synced folders. Just adding the corresponding option to the `Vagrantfile`:

```
config.vm.synced_folder ".", "/vagrant", disabled: true
```

This is directly [from Vagrant's documentation](https://www.vagrantup.com/docs/synced-folders/basic_usage.html#disabling).

## Afterword:

We created a base image we can configure via textual `Vagrantfiles`, making it easy to quickly initialize virtual machines in a controlled manner. Distribution is easy and painless, too. This is the starting point for creating reproducible environments. But everything we had to do to arrive at this point involved a lot of manual work. This is where [https://www.packer.io/](Packer) (also from HashiCorp) comes in.

> We strongly recommend using Packer to create reproducible builds for your base boxes, as well as automating the builds.

It's promoted [at the top of Vagrant's documentation](https://www.vagrantup.com/docs/boxes/base.html#packer-and-vagrant-cloud) and might be worth a look in the future. But before using higher-level tools, it's nice to first do things by hand to understand what's happening under the hood. Is this a *scientific approach* or is it simply a waste of time?