<script>
    let promise = navigator.mediaDevices.getUserMedia({video: true}); 

    function connect(node, webcam) {
        node.srcObject = webcam;
    }
</script>

<style>
    video {
        border: 2px solid #888;
        border-radius: 10px;
    }
</style>

{#await promise}
	<p>...waiting</p> 
{:then webcam}
    <video controls use:connect={webcam}/>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
