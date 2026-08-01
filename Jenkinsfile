pipeline {
    agent {
        docker {
            image 'node:22-alpine'
            reuseNode true
            args '-u 0:0'
        }
    }

    environment {
        EC2_HOST = '32.199.13.86'
        EC2_USER = 'ubuntu'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

        stage('Deploy backend to EC2') {
            steps {
                sh 'apk add --no-cache openssh-client rsync'

                sshagent(credentials: ['ec2-deploy-key']) {
                    sh '''
                        mkdir -p ~/.ssh
                        ssh-keyscan -H "$EC2_HOST" >> ~/.ssh/known_hosts

                        rsync -az --delete \
                          --exclude='.git' \
                          --exclude='node_modules' \
                          --exclude='coverage' \
                          --exclude='*.log' \
                          --exclude='.env' \
                          ./ "$EC2_USER@$EC2_HOST:/opt/my-demo-app-backend/"

                        ssh "$EC2_USER@$EC2_HOST" '
                            set -e
                            cd /opt/my-demo-app-backend
                            npm ci --omit=dev
                            sudo systemctl restart my-demo-app-backend

                            for attempt in $(seq 1 10); do
                                if curl --silent --fail http://127.0.0.1:3001/api/health; then
                                    echo "Backend health check passed."
                                    exit 0
                                fi

                                echo "Waiting for backend to start ($attempt/10)..."
                                sleep 2
                            done

                            echo "Backend did not become healthy."
                            sudo systemctl status my-demo-app-backend --no-pager || true
                            sudo journalctl -u my-demo-app-backend -n 50 --no-pager || true
                            exit 1
                        '
                    '''
                }
            }

        }

    }
}