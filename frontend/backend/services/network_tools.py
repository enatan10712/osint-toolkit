import socket
import ssl
import asyncio
import dns.resolver
import aiohttp
from typing import Dict, List
from datetime import datetime
import subprocess
import platform

async def port_scanner(target: str, ports: List[int] = None, scan_type: str = "common") -> Dict:
    """
    Port scanner - FOR AUTHORIZED NETWORKS ONLY
    WARNING: Unauthorized port scanning is ILLEGAL
    """
    
    result = {
        "target": target,
        "timestamp": datetime.now().isoformat(),
        "disclaimer": "⚠️ FOR AUTHORIZED NETWORKS ONLY - ILLEGAL WITHOUT PERMISSION ⚠️",
        "scan_type": scan_type,
        "open_ports": [],
        "closed_ports": [],
        "filtered_ports": [],
        "service_detection": {}
    }
    
    # Common ports if not specified
    if ports is None:
        if scan_type == "quick":
            ports = [21, 22, 23, 25, 80, 443, 3306, 3389, 8080]
        elif scan_type == "common":
            ports = [
                20, 21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995,
                1723, 3306, 3389, 5900, 8080, 8443
            ]
        else:  # full scan
            ports = range(1, 1025)
    
    # Resolve hostname to IP
    try:
        ip = socket.gethostbyname(target)
        result["resolved_ip"] = ip
    except socket.gaierror:
        result["error"] = "Unable to resolve hostname"
        return result
    
    # Scan ports
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            connection_result = sock.connect_ex((ip, port))
            
            if connection_result == 0:
                # Port is open
                service = get_service_name(port)
                result["open_ports"].append({
                    "port": port,
                    "state": "open",
                    "service": service
                })
                
                # Try to get banner
                try:
                    sock.send(b'GET / HTTP/1.1\r\nHost: {}\r\n\r\n'.format(target).encode())
                    banner = sock.recv(1024).decode('utf-8', errors='ignore')
                    result["service_detection"][port] = {
                        "service": service,
                        "banner": banner[:200]  # First 200 chars
                    }
                except:
                    pass
            else:
                result["closed_ports"].append(port)
            
            sock.close()
        except socket.error:
            result["filtered_ports"].append(port)
    
    # Summary
    result["summary"] = {
        "total_ports_scanned": len(ports),
        "open_ports_count": len(result["open_ports"]),
        "closed_ports_count": len(result["closed_ports"]),
        "filtered_ports_count": len(result["filtered_ports"])
    }
    
    return result


def get_service_name(port: int) -> str:
    """Get common service name for port"""
    common_ports = {
        20: "FTP-DATA", 21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
        53: "DNS", 80: "HTTP", 110: "POP3", 111: "RPC", 135: "MSRPC",
        139: "NetBIOS", 143: "IMAP", 443: "HTTPS", 445: "SMB", 993: "IMAPS",
        995: "POP3S", 1723: "PPTP", 3306: "MySQL", 3389: "RDP", 5900: "VNC",
        8080: "HTTP-Proxy", 8443: "HTTPS-Alt"
    }
    return common_ports.get(port, "Unknown")


async def ssl_certificate_analyzer(domain: str, port: int = 443) -> Dict:
    """Analyze SSL/TLS certificate"""
    
    result = {
        "domain": domain,
        "port": port,
        "timestamp": datetime.now().isoformat(),
        "certificate_info": {},
        "security_analysis": {},
        "vulnerabilities": [],
        "recommendations": []
    }
    
    try:
        context = ssl.create_default_context()
        
        with socket.create_connection((domain, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                version = ssock.version()
                
                # Certificate information
                result["certificate_info"] = {
                    "subject": dict(x[0] for x in cert.get('subject', ())),
                    "issuer": dict(x[0] for x in cert.get('issuer', ())),
                    "version": cert.get('version'),
                    "serial_number": cert.get('serialNumber'),
                    "not_before": cert.get('notBefore'),
                    "not_after": cert.get('notAfter'),
                    "san": cert.get('subjectAltName', [])
                }
                
                # TLS information
                result["tls_info"] = {
                    "protocol_version": version,
                    "cipher_suite": cipher[0] if cipher else None,
                    "cipher_bits": cipher[2] if cipher else None,
                    "cipher_version": cipher[1] if cipher else None
                }
                
                # Security analysis
                result["security_analysis"] = {
                    "tls_version_secure": version in ["TLSv1.2", "TLSv1.3"],
                    "strong_cipher": cipher[2] >= 128 if cipher else False,
                    "certificate_valid": True,  # Connected successfully
                    "wildcard_cert": '*' in str(cert.get('subject', '')),
                }
                
                # Check for vulnerabilities
                if version in ["SSLv2", "SSLv3", "TLSv1.0", "TLSv1.1"]:
                    result["vulnerabilities"].append(f"⚠️ Outdated TLS version: {version}")
                    result["recommendations"].append("Upgrade to TLS 1.2 or 1.3")
                
                if cipher and cipher[2] < 128:
                    result["vulnerabilities"].append(f"⚠️ Weak cipher strength: {cipher[2]} bits")
                    result["recommendations"].append("Use 128-bit or 256-bit ciphers")
                
                # Check certificate expiry
                import datetime as dt
                not_after = datetime.strptime(cert.get('notAfter'), '%b %d %H:%M:%S %Y %Z')
                days_until_expiry = (not_after - dt.datetime.now()).days
                
                result["expiry_info"] = {
                    "expires": cert.get('notAfter'),
                    "days_remaining": days_until_expiry,
                    "status": "Valid" if days_until_expiry > 0 else "Expired"
                }
                
                if days_until_expiry < 30:
                    result["vulnerabilities"].append(f"⚠️ Certificate expires in {days_until_expiry} days")
                    result["recommendations"].append("Renew certificate soon")
                
    except Exception as e:
        result["error"] = str(e)
        result["vulnerabilities"].append("Unable to establish SSL connection")
    
    return result


async def dns_enumeration(domain: str) -> Dict:
    """Perform DNS enumeration"""
    
    result = {
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "dns_records": {},
        "nameservers": [],
        "mail_servers": [],
        "subdomains_found": [],
        "dns_security": {}
    }
    
    try:
        resolver = dns.resolver.Resolver()
        
        # A Records
        try:
            a_records = resolver.resolve(domain, 'A')
            result["dns_records"]["A"] = [str(r) for r in a_records]
        except:
            result["dns_records"]["A"] = []
        
        # AAAA Records (IPv6)
        try:
            aaaa_records = resolver.resolve(domain, 'AAAA')
            result["dns_records"]["AAAA"] = [str(r) for r in aaaa_records]
        except:
            result["dns_records"]["AAAA"] = []
        
        # MX Records
        try:
            mx_records = resolver.resolve(domain, 'MX')
            result["dns_records"]["MX"] = [f"{r.preference} {r.exchange}" for r in mx_records]
            result["mail_servers"] = [str(r.exchange) for r in mx_records]
        except:
            result["dns_records"]["MX"] = []
        
        # NS Records
        try:
            ns_records = resolver.resolve(domain, 'NS')
            result["dns_records"]["NS"] = [str(r) for r in ns_records]
            result["nameservers"] = [str(r) for r in ns_records]
        except:
            result["dns_records"]["NS"] = []
        
        # TXT Records
        try:
            txt_records = resolver.resolve(domain, 'TXT')
            result["dns_records"]["TXT"] = [str(r) for r in txt_records]
        except:
            result["dns_records"]["TXT"] = []
        
        # CNAME Records
        try:
            cname_records = resolver.resolve(domain, 'CNAME')
            result["dns_records"]["CNAME"] = [str(r) for r in cname_records]
        except:
            result["dns_records"]["CNAME"] = []
        
        # SOA Record
        try:
            soa_record = resolver.resolve(domain, 'SOA')
            result["dns_records"]["SOA"] = [str(r) for r in soa_record]
        except:
            result["dns_records"]["SOA"] = []
        
        # DNS Security checks
        result["dns_security"] = {
            "dnssec_enabled": check_dnssec(domain),
            "spf_record": check_spf(result["dns_records"].get("TXT", [])),
            "dmarc_record": check_dmarc(result["dns_records"].get("TXT", [])),
            "dkim_configured": "v=DKIM1" in str(result["dns_records"].get("TXT", []))
        }
        
    except Exception as e:
        result["error"] = str(e)
    
    return result


def check_dnssec(domain: str) -> bool:
    """Check if DNSSEC is enabled"""
    try:
        resolver = dns.resolver.Resolver()
        resolver.resolve(domain, 'DNSKEY')
        return True
    except:
        return False


def check_spf(txt_records: List[str]) -> bool:
    """Check for SPF record"""
    return any('v=spf1' in record for record in txt_records)


def check_dmarc(txt_records: List[str]) -> bool:
    """Check for DMARC record"""
    return any('v=DMARC1' in record for record in txt_records)


async def subdomain_discovery(domain: str, wordlist: List[str] = None) -> Dict:
    """Discover subdomains"""
    
    result = {
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "subdomains_found": [],
        "total_tested": 0,
        "method": "DNS brute force"
    }
    
    # Common subdomain list if not provided
    if wordlist is None:
        wordlist = [
            "www", "mail", "ftp", "localhost", "webmail", "smtp", "pop", "ns1", "ns2",
            "webdisk", "ns", "cpanel", "whm", "autodiscover", "autoconfig", "m", "imap",
            "test", "ns3", "blog", "dev", "admin", "mysql", "api", "cdn", "portal",
            "staging", "app", "beta", "vpn", "git", "shop", "store", "mobile"
        ]
    
    resolver = dns.resolver.Resolver()
    resolver.timeout = 1
    resolver.lifetime = 1
    
    for subdomain in wordlist:
        full_domain = f"{subdomain}.{domain}"
        try:
            answers = resolver.resolve(full_domain, 'A')
            ips = [str(r) for r in answers]
            result["subdomains_found"].append({
                "subdomain": full_domain,
                "ips": ips,
                "type": "A"
            })
        except:
            pass
        
        result["total_tested"] += 1
    
    result["subdomains_count"] = len(result["subdomains_found"])
    
    return result


async def traceroute(target: str, max_hops: int = 30) -> Dict:
    """Perform traceroute to target"""
    
    result = {
        "target": target,
        "timestamp": datetime.now().isoformat(),
        "hops": [],
        "total_hops": 0,
        "disclaimer": "Network diagnostic tool"
    }
    
    try:
        # Use system traceroute/tracert
        if platform.system() == "Windows":
            cmd = ["tracert", "-h", str(max_hops), target]
        else:
            cmd = ["traceroute", "-m", str(max_hops), target]
        
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        output, error = process.communicate(timeout=60)
        
        # Parse output
        lines = output.split('\n')
        hop_num = 0
        
        for line in lines:
            if 'ms' in line or '*' in line:
                hop_num += 1
                result["hops"].append({
                    "hop": hop_num,
                    "info": line.strip()
                })
        
        result["total_hops"] = hop_num
        result["raw_output"] = output
        
    except Exception as e:
        result["error"] = str(e)
    
    return result
