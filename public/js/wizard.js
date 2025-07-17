document.addEventListener('DOMContentLoaded', function () {
    function nextStep(currentStep) {
        document.getElementById('step' + currentStep).classList.remove('active');
        document.getElementById('step' + (currentStep + 1)).classList.add('active');
    }

    document.getElementById('nextStep1').addEventListener('click', function () {
        nextStep(1);
    });

    document.getElementById('nextStep2').addEventListener('click', function () {
        nextStep(2);
    });

});
