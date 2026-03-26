'use client';
import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function UploadProofForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate file type and size
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selected.type)) {
      setErrorMsg('INVALID_FORMAT: Only PNG, JPG, WEBP accepted.');
      setStatus('error');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setErrorMsg('FILE_OVERFLOW: Max 5MB allowed.');
      setStatus('error');
      return;
    }

    setFile(selected);
    setStatus('idle');
    setErrorMsg('');

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setErrorMsg('SESSION_EXPIRED: Please re-authenticate.');
        setStatus('error');
        return;
      }

      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('proof-images')
        .upload(fileName, file, { upsert: true });

      if (uploadErr) {
        setErrorMsg(uploadErr.message);
        setStatus('error');
        return;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('proof-images')
        .getPublicUrl(uploadData.path);

      // Update the user's latest score with the proof image
      const { data: latestScore } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestScore) {
        await supabase
          .from('scores')
          .update({ status: 'pending', image_url: urlData.publicUrl })
          .eq('id', latestScore.id);
      }

      setStatus('success');
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'UPLOAD_FAILED');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 border-2 border-dashed border-green-500/50 bg-green-950/20 text-green-400 font-mono text-xs uppercase text-center rounded-xl flex flex-col items-center gap-2">
        <CheckCircle className="w-6 h-6" />
        <span className="tracking-widest font-bold">[ CRYPTOGRAPHIC PROOF SECURED // AWAITING ADMIN AUDIT ]</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Drop Zone */}
      <div 
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all group ${
          file 
            ? 'border-amber-500/50 bg-amber-950/10' 
            : 'border-slate-700 hover:border-amber-500/30 hover:bg-slate-800/30'
        }`}
      >
        <input 
          ref={fileRef}
          type="file" 
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden" 
        />
        
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img src={preview} alt="Proof preview" className="max-h-40 rounded-lg border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]" />
            <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">{file?.name}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-amber-400 transition-colors" />
            <span className="font-mono text-xs text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest">
              Click to select scorecard image
            </span>
            <span className="font-mono text-[10px] text-slate-600">PNG, JPG, WEBP — Max 5MB</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 font-mono text-xs bg-red-950/20 border border-red-500/30 p-3 rounded">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit */}
      <button 
        type="submit" 
        disabled={!file || status === 'loading'}
        className="w-full py-3 bg-amber-950/40 border-2 border-amber-500 text-amber-500 font-mono text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '[ UPLOADING PROOF... ]' : '[ SUBMIT CRYPTOGRAPHIC PROOF ]'}
      </button>
    </form>
  );
}
