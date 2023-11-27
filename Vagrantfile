# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
    # https://developer.hashicorp.com/vagrant/docs/cli
  
    config.vm.provider :virtualbox do |vb|
      vb.name = "todo"
    end
  
    config.vm.box = "ubuntu/focal64"
    config.vm.box_check_update = true
    config.vm.boot_timeout = 300
  
    # Forwarded ports
    config.vm.network "forwarded_port", guest: 8000, host: 8000
    config.vm.network "forwarded_port", guest: 3000, host: 3000
    config.vm.network "forwarded_port", guest: 27017, host: 27017
  
    config.vm.provider "virtualbox" do |vb|
      vb.memory = "2224"
    end
  
    # provision required tooling
    config.vm.provision "shell", privileged: false, inline: <<-SHELL
      echo "Install Initial Updates and Utilities"
      sudo apt-get update -y
      sudo apt-get install -y \
          ca-certificates \
          curl \
          gnupg \
          lsb-release \
          git
  
      echo "Add Docker Keys"
      sudo mkdir -p /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  
      echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
      echo "Install Docker"
      sudo apt-get update -y
      sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
      sudo systemctl enable docker
  
      echo "Install Docker Compose"
      sudo curl -SL https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-linux-x86_64 -o /usr/bin/docker-compose
      sudo chmod +x /usr/bin/docker-compose
      sudo usermod -aG docker vagrant
  
      echo "Install Kubectl"
      sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
      echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
      sudo apt-get update -y
      sudo apt-get install -y kubectl
  
      echo "Install Helm"
      curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  
      echo "Install Openshift Client"
      sudo curl https://gitlab-sjc.cisco.com/cxInnovations/iad/tools/-/raw/main/oc --output /usr/bin/oc
      sudo chmod +x /usr/bin/oc
  
      echo "Install Stern"
      sudo curl https://gitlab-sjc.cisco.com/cxInnovations/iad/tools/-/raw/main/stern --output /usr/bin/stern
      sudo chmod +x /usr/bin/stern
  
      echo "Add Python Repo"
      sudo add-apt-repository -y ppa:deadsnakes/ppa
      sudo apt-get update -y
  
      echo "Install Python 3.10"
      sudo apt-get install -y python3.10
      sudo apt-get install -y python3-pip
      sudo apt-get install -y python3.10-distutils
  
      echo "Set Python 3.10 as default"
      sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 2
      sudo update-alternatives --config python3
  
      echo "Fix Python Pip"
      sudo apt remove -y --purge python3-apt
      sudo apt autoclean
      sudo apt install -y python3-apt
  
      echo "Update Python Pip"
      curl -sS https://bootstrap.pypa.io/get-pip.py | python3
  
      echo "Install NodeJS 18"
      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
      sudo apt-get install -y nodejs
  
      echo "Enable Yarn Package Manager"
      sudo corepack enable
      corepack prepare yarn@stable --activate
  
      echo "Install Poetry Package Manager"
      curl -sSL https://install.python-poetry.org | python3 -
      echo 'export PATH="/home/vagrant/.local/bin:$PATH"' >> /home/vagrant/.bashrc
      export PATH="/home/vagrant/.local/bin:$PATH"
  
    SHELL
  end
