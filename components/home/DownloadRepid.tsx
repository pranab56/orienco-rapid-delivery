import Image from "next/image";

export default function DownloadRepid() {
    return (
        <section>
            <div className="container mx-auto px-4 pb-20 pt-10">
                <Image src="/images/download-rapid.png" width={10000} height={10000} alt="download-rapid" className="w-full h-full " quality={100} />
            </div>
        </section>
    )
}
