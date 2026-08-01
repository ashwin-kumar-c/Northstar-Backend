pipeline {
    agent {
        docker {
            image 'node:22-alpine'
            reuseNode true
        }

        environment {
            EC2_HOST = '107.20.25.36'
            EC2_USER = 'ubuntu'
        }
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

    }
}