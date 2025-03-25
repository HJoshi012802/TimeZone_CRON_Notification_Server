pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("Environment Setup"){
            environment{
                var1 = credentials("ENV_PRODUCTION");
            }
            steps{
                sh 'Build Docker Image'
                sh 'touch .env'
                sh "echo '$var1' > .env "
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'Build Docker Image'
                sh 'docker build -t notification-cron:${BUILD_NUMBER} -t notification-cron:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
               sh 'docker stop notification-cron || true'
               sh 'docker rm notification-cron || true'
               sh 'docker run -d --name notification-cron -p 2025:2025 notification-cron:latest'
            }
        }

    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}